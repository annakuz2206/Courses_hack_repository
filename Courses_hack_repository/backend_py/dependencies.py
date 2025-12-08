"""
FastAPI зависимости.
"""

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from models import Participant
from config import JWT_SECRET, JWT_ALG, ADMIN_TELEGRAM_IDS
from storage import participants

# Схема безопасности для Swagger (Bearer JWT)
bearer_scheme = HTTPBearer()


def get_current_participant(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> Participant:
    """
    Достаём участника из JWT в заголовке Authorization: Bearer <token>.
    Используем только для тех эндпоинтов, где нужна авторизация участника.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Токен истёк")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Некорректный токен")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Некорректный токен (нет sub)")

    # Отладочная информация
    participant_ids_in_list = [p.id for p in participants]
    print(f"🔍 Поиск участника: '{user_id}'")
    print(f"   Всего участников в списке: {len(participants)}")
    print(f"   ID участников: {participant_ids_in_list[-5:]}")
    
    participant = next((p for p in participants if p.id == user_id), None)
    if participant is None:
        # Более детальное сообщение об ошибке для отладки
        print(f"❌ Участник '{user_id}' не найден в списке!")
        print(f"   Полный список ID: {participant_ids_in_list}")
        raise HTTPException(
            status_code=404, 
            detail=f"Участник не найден. Ищем: '{user_id}'. Доступные ID: {participant_ids_in_list[-10:]}"
        )

    print(f"✅ Участник найден: {participant.name} (id: {participant.id})")
    return participant


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> Participant:
    """
    Проверяет, что текущий пользователь является админом.
    Используется для эндпоинтов, требующих прав администратора.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Токен истёк")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Некорректный токен")

    user_id = payload.get("sub")
    role = payload.get("role", "participant")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Некорректный токен (нет sub)")
    
    # Проверяем роль
    if role != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Доступ запрещён. Требуются права администратора."
        )
    
    # Проверяем, что пользователь существует
    participant = next((p for p in participants if p.id == user_id), None)
    if participant is None:
        raise HTTPException(status_code=404, detail="Участник не найден")
    
    return participant

