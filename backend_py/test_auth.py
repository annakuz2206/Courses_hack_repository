#!/usr/bin/env python3
"""
Скрипт для тестирования авторизации через Telegram бота.
"""

import requests
import sys

API_URL = "http://localhost:8000"


def test_health():
    """Проверка, что сервер запущен."""
    print("🔍 Проверка здоровья сервера...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Сервер работает")
            return True
        else:
            print(f"❌ Сервер вернул статус {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Не удалось подключиться к серверу")
        print("   Убедитесь, что бэкенд запущен на http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False


def test_code_validation(code: str):
    """Тест проверки кода."""
    print(f"\n🔍 Тест 1: Проверка кода...")
    try:
        response = requests.get(
            f"{API_URL}/api/auth/bot-code/validate/{code}",
            timeout=5
        )
        print(f"   Статус: {response.status_code}")
        data = response.json()
        print(f"   Ответ: {data}")
        
        if data.get("valid"):
            print("   ✅ Код действителен")
            return True, data.get("user_name")
        else:
            print(f"   ❌ Код недействителен: {data.get('message')}")
            return False, None
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return False, None


def test_auth(code: str):
    """Тест авторизации."""
    print(f"\n🔍 Тест 2: Авторизация через код...")
    try:
        response = requests.post(
            f"{API_URL}/api/auth/bot-code",
            json={"code": code},
            timeout=5
        )
        print(f"   Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print(f"   ✅ Получен токен: {token[:20]}...")
            return True, token
        else:
            error_data = response.json()
            print(f"   ❌ Ошибка: {error_data.get('detail', 'Unknown error')}")
            return False, None
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return False, None


def test_token_validation(token: str):
    """Тест проверки токена."""
    print(f"\n🔍 Тест 3: Проверка JWT токена...")
    try:
        response = requests.get(
            f"{API_URL}/api/auth/debug-token",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        print(f"   Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Токен валиден")
            print(f"   Пользователь ID: {data.get('jwt_payload', {}).get('sub')}")
            return True
        else:
            error_data = response.json()
            print(f"   ❌ Ошибка: {error_data.get('detail', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return False


def test_code_used(code: str):
    """Тест, что код помечен как использованный."""
    print(f"\n🔍 Тест 4: Проверка, что код использован...")
    try:
        response = requests.get(
            f"{API_URL}/api/auth/bot-code/validate/{code}",
            timeout=5
        )
        data = response.json()
        
        if not data.get("valid"):
            print("   ✅ Код правильно помечен как использованный")
            return True
        else:
            print("   ❌ Код всё ещё валиден (должен быть использован)")
            return False
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return False


def main():
    """Главная функция."""
    print("=" * 60)
    print("🧪 Тестирование авторизации через Telegram бота")
    print("=" * 60)
    
    # Проверка сервера
    if not test_health():
        print("\n❌ Тесты прерваны: сервер не доступен")
        sys.exit(1)
    
    # Получение кода
    print("\n" + "=" * 60)
    code = input("📝 Введите код от бота (команда /login): ").strip()
    
    if not code:
        print("❌ Код не введён")
        sys.exit(1)
    
    print(f"   Используется код: {code[:10]}...")
    
    # Тесты
    results = []
    
    # Тест 1: Проверка кода
    valid, user_name = test_code_validation(code)
    results.append(("Проверка кода", valid))
    
    if not valid:
        print("\n❌ Код недействителен. Получите новый код от бота.")
        sys.exit(1)
    
    if user_name:
        print(f"   👤 Имя пользователя: {user_name}")
    
    # Тест 2: Авторизация
    success, token = test_auth(code)
    results.append(("Авторизация", success))
    
    if not success or not token:
        print("\n❌ Не удалось получить токен")
        sys.exit(1)
    
    # Тест 3: Проверка токена
    token_valid = test_token_validation(token)
    results.append(("Проверка токена", token_valid))
    
    # Тест 4: Код использован
    code_used = test_code_used(code)
    results.append(("Код использован", code_used))
    
    # Итоги
    print("\n" + "=" * 60)
    print("📊 Результаты тестирования:")
    print("=" * 60)
    
    all_passed = True
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {status} - {test_name}")
        if not passed:
            all_passed = False
    
    print("=" * 60)
    if all_passed:
        print("🎉 Все тесты пройдены успешно!")
        print("\n✅ Интеграция Telegram бота с сайтом работает корректно!")
    else:
        print("❌ Некоторые тесты не прошли")
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Тестирование прервано пользователем")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Неожиданная ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

