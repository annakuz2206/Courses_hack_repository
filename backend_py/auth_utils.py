"""
Утилиты для авторизации: JWT и проверка Telegram подписи.
"""

import hmac
import hashlib
import time
import jwt
from models import TelegramAuthPayload
from config import TELEGRAM_BOT_TOKEN, JWT_SECRET, JWT_ALG, JWT_TTL_SECONDS


def _build_telegram_check_string(data: TelegramAuthPayload) -> str:
    # порядок полей фиксированный, без hash
    fields = {
        "auth_date": str(data.auth_date),
        "first_name": data.first_name,
        "id": str(data.id),
        "last_name": data.last_name,
        "photo_url": data.photo_url,
        "username": data.username,
    }
    # убираем None и собираем "key=value"
    parts = [f"{k}={v}" for k, v in fields.items() if v is not None]
    # сортируем по ключу в алфавитном порядке
    parts.sort()
    return "\n".join(parts)


def verify_telegram_auth(data: TelegramAuthPayload) -> bool:
    """
    Проверка подписи от Telegram по инструкции:
    https://core.telegram.org/widgets/login#checking-authorization
    """
    if TELEGRAM_BOT_TOKEN.startswith("CHANGE_ME_"):
        # Для MVP, если токен не настроен, просто не валим, но и не доверяем
        return False

    check_string = _build_telegram_check_string(data)
    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    calculated_hash = hmac.new(
        secret_key, msg=check_string.encode(), digestmod=hashlib.sha256
    ).hexdigest()
    # сравниваем в constant time
    return hmac.compare_digest(calculated_hash, data.hash)


def issue_jwt(user_id: str, role: str = "participant") -> str:
    """
    Выдаёт JWT токен для пользователя.
    
    Args:
        user_id: ID пользователя
        role: Роль пользователя ("participant" или "admin")
    """
    now = int(time.time())
    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + JWT_TTL_SECONDS,
        "role": role,
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
    # В pyjwt>=2 jwt.encode возвращает str, но если вдруг bytes — декодируем
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


def decode_jwt(token: str) -> dict:
    """Декодирует JWT токен."""
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])

