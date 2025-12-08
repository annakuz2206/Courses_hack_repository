"""
Конфигурация приложения.
"""

import os

# Пытаемся загрузить dotenv, но не критично, если его нет
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # Если python-dotenv не установлен, просто пропускаем загрузку .env
    # Переменные окружения можно установить вручную
    pass

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "CHANGE_ME_TELEGRAM_BOT_TOKEN")
JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME_JWT_SECRET")
JWT_ALG = "HS256"
JWT_TTL_SECONDS = 60 * 60 * 12  # 12 часов

# Список ID админов (Telegram user IDs)
# В production лучше хранить в БД или переменных окружения
ADMIN_TELEGRAM_IDS_ENV = os.getenv("ADMIN_TELEGRAM_IDS", "")
if ADMIN_TELEGRAM_IDS_ENV:
    ADMIN_TELEGRAM_IDS = [
        int(id.strip()) for id in ADMIN_TELEGRAM_IDS_ENV.split(",") if id.strip()
    ]
else:
    ADMIN_TELEGRAM_IDS = [5035505042]

# Для тестирования можно добавить конкретные ID вручную
# Раскомментируйте следующую строку и укажите ваш Telegram User ID:
# ADMIN_TELEGRAM_IDS = [5035505042]  # Замените на ваш Telegram User ID

