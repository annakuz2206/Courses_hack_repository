"""
Роутеры для авторизации.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials
import jwt
from models import (
    TelegramAuthPayload,
    AuthResponse,
    DevLoginRequest,
    BotAuthRequest,
    Participant,
    CodeValidationResponse,
)
from auth_utils import verify_telegram_auth, issue_jwt
from config import JWT_SECRET, JWT_ALG, ADMIN_TELEGRAM_IDS
from storage import participants
from dependencies import bearer_scheme
from telegram_bot import get_auth_code_info, mark_code_as_used

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/telegram", response_model=AuthResponse)
def auth_telegram(body: TelegramAuthPayload) -> AuthResponse:
    # 1. Проверяем подпись
    if not verify_telegram_auth(body):
        raise HTTPException(status_code=401, detail="Некорректная подпись Telegram")

    # 2. Находим или создаём участника (MVP: создаём, если нет)
    user_id = f"tg_{body.id}"
    
    # Проверяем, является ли пользователь админом
    is_admin = body.id in ADMIN_TELEGRAM_IDS
    user_role = "admin" if is_admin else "participant"
    
    existing = next((p for p in participants if p.id == user_id), None)

    if existing is None:
        # Добавляем нового участника с минимальными полями
        new_participant = Participant(
            id=user_id,
            name=body.first_name,
            age=0,  # неизвестно, оставляем 0
            role="",
            skills=[],
            bio="",
            hackathonId="",
            experienceHackathons=0,
        )
        participants.append(new_participant)

    # 3. Выдаём JWT с правильной ролью
    token = issue_jwt(user_id, role=user_role)
    return AuthResponse(access_token=token)


@router.post("/dev-login", response_model=AuthResponse)
def dev_login(body: DevLoginRequest) -> AuthResponse:
    """
    Выдаёт JWT для существующего участника без проверки Telegram.
    Сделано только для удобства разработки и тестирования.
    """
    participant = next((p for p in participants if p.id == body.participantId), None)
    if participant is None:
        raise HTTPException(status_code=404, detail="Участник не найден")

    # Определяем роль: если role == "admin", то выдаем токен с ролью admin
    user_role = "admin" if participant.role == "admin" else "participant"
    token = issue_jwt(participant.id, role=user_role)
    return AuthResponse(access_token=token)


@router.get("/bot-code/validate/{code}", response_model=CodeValidationResponse)
def validate_bot_code(code: str) -> CodeValidationResponse:
    """
    Проверка кода от Telegram бота БЕЗ использования.
    Используется фронтендом для валидации кода из URL параметра.
    
    Код не помечается как использованный, это только проверка.
    """
    code_info = get_auth_code_info(code)
    
    if code_info is None:
        return CodeValidationResponse(
            valid=False,
            message="Код недействителен, истёк или уже использован"
        )
    
    return CodeValidationResponse(
        valid=True,
        message="Код действителен",
        user_name=code_info.get("first_name", "Пользователь")
    )


@router.post("/bot-code", response_model=AuthResponse)
def auth_bot_code(body: BotAuthRequest) -> AuthResponse:
    """
    Авторизация через код, полученный от Telegram бота.
    
    Процесс:
    1. Пользователь получает код в боте командой /login
    2. Пользователь переходит на сайт по ссылке или вводит код вручную
    3. Фронтенд может проверить код через GET /api/auth/bot-code/validate/{code}
    4. Этот эндпоинт проверяет код и выдаёт JWT токен (код помечается как использованный)
    
    Пример использования:
    - Бот отправляет: "Код: ABC123" и ссылку "https://site.com/auth?code=ABC123"
    - Фронтенд читает code из URL параметра
    - Фронтенд вызывает GET /api/auth/bot-code/validate/ABC123 для проверки
    - Если код валиден, фронтенд вызывает POST /api/auth/bot-code с {"code": "ABC123"}
    - Получает JWT токен и сохраняет его
    """
    # Получаем информацию о коде
    code_info = get_auth_code_info(body.code)
    
    if code_info is None:
        raise HTTPException(
            status_code=401,
            detail="Код недействителен, истёк или уже использован"
        )
    
    # Помечаем код как использованный
    mark_code_as_used(body.code)
    
    # Создаём или находим участника
    telegram_user_id = code_info["telegram_user_id"]
    user_id = f"tg_{telegram_user_id}"
    
    # Проверяем, является ли пользователь админом
    is_admin = telegram_user_id in ADMIN_TELEGRAM_IDS
    user_role = "admin" if is_admin else "participant"
    
    existing = next((p for p in participants if p.id == user_id), None)
    
    if existing is None:
        # Создаём нового участника
        new_participant = Participant(
            id=user_id,
            name=code_info["first_name"],
            age=0,
            role="",
            skills=[],
            bio="",
            hackathonId="",
            experienceHackathons=0,
        )
        participants.append(new_participant)
        role_text = "админ" if is_admin else "участник"
        print(f"✅ Создан новый {role_text}: {user_id} ({code_info['first_name']})")
        print(f"   Всего участников в списке: {len(participants)}")
        # Проверяем, что участник действительно добавлен
        check = next((p for p in participants if p.id == user_id), None)
        if check:
            print(f"   ✅ Подтверждено: участник {user_id} найден в списке")
        else:
            print(f"   ❌ ОШИБКА: участник {user_id} НЕ найден в списке после добавления!")
    else:
        print(f"✅ Найден существующий участник: {user_id}")
    
    # Выдаём JWT с правильной ролью
    token = issue_jwt(user_id, role=user_role)
    return AuthResponse(access_token=token)


@router.get("/debug-token")
def debug_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """
    DEV: посмотреть, что лежит внутри текущего JWT и какие id есть в participants.
    Помогает отлаживать авторизацию.
    """
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"Token decode error: {exc}")

    return {
        "jwt_payload": payload,
        "participant_ids": [p.id for p in participants],
    }

