"""
Telegram бот для авторизации на сайте.

Бот генерирует временные коды авторизации, которые пользователь может использовать
для входа на сайт без необходимости использовать Telegram Login Widget.
"""

import os
import secrets
import time
import traceback
import json
import threading
from typing import Dict, Optional
from datetime import datetime, timedelta
from pathlib import Path

# Пытаемся загрузить dotenv, но не критично, если его нет
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # Если python-dotenv не установлен, просто пропускаем загрузку .env
    # Переменные окружения можно установить вручную
    pass

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# Время жизни кода (5 минут)
CODE_TTL_SECONDS = 5 * 60

# Файл для хранения кодов (общий для бота и сервера)
AUTH_CODES_FILE = Path(__file__).parent / ".auth_codes.json"
_lock = threading.Lock()


def _load_auth_codes() -> Dict[str, dict]:
    """Загружает коды из файла"""
    if not AUTH_CODES_FILE.exists():
        return {}
    try:
        with open(AUTH_CODES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return {}


def _save_auth_codes(codes: Dict[str, dict]) -> None:
    """Сохраняет коды в файл"""
    try:
        with open(AUTH_CODES_FILE, 'w', encoding='utf-8') as f:
            json.dump(codes, f, ensure_ascii=False, indent=2)
    except IOError:
        pass  # Игнорируем ошибки записи


def generate_auth_code(telegram_user_id: int, username: Optional[str], first_name: str) -> str:
    """
    Генерирует уникальный код авторизации для пользователя.
    
    Args:
        telegram_user_id: ID пользователя в Telegram
        username: Username пользователя (может быть None)
        first_name: Имя пользователя
        
    Returns:
        Строка с кодом авторизации
    """
    code = secrets.token_urlsafe(16)  # Генерируем безопасный случайный код
    
    with _lock:
        auth_codes = _load_auth_codes()
        auth_codes[code] = {
            "telegram_user_id": telegram_user_id,
            "username": username,
            "first_name": first_name,
            "created_at": time.time(),
            "used": False,
        }
        _save_auth_codes(auth_codes)
    
    return code


def get_auth_code_info(code: str) -> Optional[dict]:
    """
    Получает информацию о коде авторизации.
    
    Args:
        code: Код авторизации
        
    Returns:
        Словарь с информацией о пользователе или None, если код недействителен
    """
    with _lock:
        auth_codes = _load_auth_codes()
        
        if code not in auth_codes:
            return None
        
        code_info = auth_codes[code]
        
        # Проверяем, не истёк ли код
        if time.time() - code_info["created_at"] > CODE_TTL_SECONDS:
            # Удаляем истёкший код
            del auth_codes[code]
            _save_auth_codes(auth_codes)
            return None
        
        # Проверяем, не использован ли код
        if code_info["used"]:
            return None
        
        return code_info


def mark_code_as_used(code: str) -> bool:
    """
    Помечает код как использованный.
    
    Args:
        code: Код авторизации
        
    Returns:
        True, если код был найден и помечен, False иначе
    """
    with _lock:
        auth_codes = _load_auth_codes()
        
        if code not in auth_codes:
            return False
        
        auth_codes[code]["used"] = True
        _save_auth_codes(auth_codes)
        return True


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /start"""
    user = update.effective_user
    
    welcome_text = (
        f"Привет, {user.first_name}! 👋\n\n"
        "Я бот для авторизации на платформе ITAM Hackathon Team Matching.\n\n"
        "Используй команду /login чтобы получить код для входа на сайт."
    )
    
    await update.message.reply_text(welcome_text)


async def login_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /login - генерирует код авторизации"""
    try:
        if not update.message:
            print("❌ Ошибка: update.message отсутствует")
            return
            
        user = update.effective_user
        if not user:
            print("❌ Ошибка: user отсутствует")
            await update.message.reply_text("❌ Не удалось получить информацию о пользователе.")
            return
        
        print(f"🔍 Обработка /login для пользователя {user.id} ({user.first_name})")
        
        # Генерируем код
        first_name = user.first_name if user.first_name else "Пользователь"
        code = generate_auth_code(
            telegram_user_id=user.id,
            username=user.username,
            first_name=first_name
        )
        
        print(f"✅ Код сгенерирован: {code[:10]}...")
        
        # Получаем URL сайта из переменной окружения или используем дефолтный
        site_url = os.getenv("SITE_URL", "http://localhost:3000")
        auth_url = f"{site_url}/auth?code={code}"
        
        # Проверяем, является ли URL localhost (Telegram не принимает localhost в кнопках)
        is_localhost = "localhost" in site_url or "127.0.0.1" in site_url
        
        # Создаём кнопку только если URL не localhost
        reply_markup = None
        if not is_localhost:
            keyboard = [
                [InlineKeyboardButton("🔗 Перейти на сайт", url=auth_url)]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            message_text = (
                f"🔐 Код авторизации:\n\n"
                f"{code}\n\n"
                f"⏱ Код действителен {CODE_TTL_SECONDS // 60} минут.\n\n"
                f"Перейди по ссылке ниже или скопируй код и введи его на сайте."
            )
        else:
            # Для localhost просто отправляем код без кнопки
            message_text = (
                f"🔐 Код авторизации:\n\n"
                f"{code}\n\n"
                f"⏱ Код действителен {CODE_TTL_SECONDS // 60} минут.\n\n"
                f"Скопируй код и введи его на сайте: {site_url}/auth?code={code}"
            )
        
        print(f"📤 Отправка сообщения пользователю {user.id}...")
        await update.message.reply_text(
            message_text,
            reply_markup=reply_markup
        )
        print(f"✅ Сообщение успешно отправлено пользователю {user.id}")
        
    except Exception as e:
        # Логируем ошибку с полным traceback
        error_details = traceback.format_exc()
        print(f"❌ Ошибка при обработке команды /login:")
        print(f"   Тип ошибки: {type(e).__name__}")
        print(f"   Сообщение: {str(e)}")
        print(f"   Полный traceback:\n{error_details}")
        
        error_message = (
            "❌ Произошла ошибка при генерации кода. "
            "Попробуй ещё раз через несколько секунд."
        )
        try:
            if update.message:
                await update.message.reply_text(error_message)
        except Exception as send_error:
            print(f"❌ Не удалось отправить сообщение об ошибке: {send_error}")


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /help"""
    help_text = (
        "📖 Доступные команды:\n\n"
        "/start - Начать работу с ботом\n"
        "/login - Получить код для авторизации на сайте\n"
        "/help - Показать эту справку\n\n"
        "💡 Используй /login чтобы получить временный код для входа на платформу."
    )
    
    await update.message.reply_text(help_text)


def run_bot():
    """Запускает Telegram бота"""
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    
    if not bot_token or bot_token.startswith("CHANGE_ME_"):
        print("⚠️  ВНИМАНИЕ: TELEGRAM_BOT_TOKEN не установлен!")
        print("   Установите переменную окружения TELEGRAM_BOT_TOKEN")
        print("   Для получения токена создайте бота через @BotFather в Telegram")
        return
    
    # Создаём приложение
    application = Application.builder().token(bot_token).build()
    
    # Регистрируем обработчики команд
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("login", login_command))
    application.add_handler(CommandHandler("help", help_command))
    
    # Добавляем обработчик ошибок
    async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Обработчик ошибок"""
        print(f"❌ Ошибка в боте: {context.error}")
        if isinstance(update, Update) and update.message:
            try:
                await update.message.reply_text(
                    "❌ Произошла ошибка. Попробуй ещё раз."
                )
            except:
                pass
    
    application.add_error_handler(error_handler)
    
    # Запускаем бота
    print("🤖 Telegram бот запущен!")
    print("   Бот готов принимать команды...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    run_bot()

