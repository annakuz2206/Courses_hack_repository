#!/usr/bin/env python3
"""
Скрипт для тестирования админского функционала.
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


def test_get_hackathons():
    """Тест получения списка хакатонов (публичный эндпоинт)."""
    print(f"\n🔍 Тест 1: Получение списка хакатонов (публичный)...")
    try:
        response = requests.get(f"{API_URL}/api/hackathons", timeout=5)
        print(f"   Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            count = len(data.get("hackathons", []))
            print(f"   ✅ Получено хакатонов: {count}")
            return True
        else:
            print(f"   ❌ Ошибка: {response.json()}")
            return False
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return False


def test_create_hackathon(token: str):
    """Тест создания хакатона (требует админа)."""
    print(f"\n🔍 Тест 2: Создание хакатона (требует админа)...")
    try:
        new_hackathon = {
            "name": "Test Hackathon 2024",
            "description": "Тестовый хакатон для проверки функционала",
            "startDate": "2024-12-15T10:00:00",
            "endDate": "2024-12-17T18:00:00",
            "location": "Онлайн",
            "maxTeamSize": 5,
            "status": "upcoming"
        }
        
        response = requests.post(
            f"{API_URL}/api/hackathons",
            json=new_hackathon,
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        print(f"   Статус: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            hackathon_id = data.get("hackathon", {}).get("id")
            print(f"   ✅ Хакатон создан: {data.get('hackathon', {}).get('name')} (id: {hackathon_id})")
            return True, hackathon_id
        else:
            error_data = response.json()
            print(f"   ❌ Ошибка: {error_data.get('detail', 'Unknown error')}")
            return False, None
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return False, None


def test_update_hackathon(token: str, hackathon_id: str):
    """Тест обновления хакатона (требует админа)."""
    print(f"\n🔍 Тест 3: Обновление хакатона (требует админа)...")
    try:
        update_data = {
            "description": "Обновлённое описание тестового хакатона",
            "status": "active"
        }
        
        response = requests.put(
            f"{API_URL}/api/hackathons/{hackathon_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        print(f"   Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Хакатон обновлён: {data.get('hackathon', {}).get('name')}")
            print(f"   Новый статус: {data.get('hackathon', {}).get('status')}")
            return True
        else:
            error_data = response.json()
            print(f"   ❌ Ошибка: {error_data.get('detail', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return False


def test_delete_hackathon(token: str, hackathon_id: str):
    """Тест удаления хакатона (требует админа)."""
    print(f"\n🔍 Тест 4: Удаление хакатона (требует админа)...")
    try:
        response = requests.delete(
            f"{API_URL}/api/hackathons/{hackathon_id}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        print(f"   Статус: {response.status_code}")
        
        if response.status_code == 204:
            print(f"   ✅ Хакатон удалён")
            return True
        else:
            error_data = response.json()
            print(f"   ❌ Ошибка: {error_data.get('detail', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return False


def test_admin_access_denied(token: str):
    """Тест, что обычный пользователь не может создавать хакатоны."""
    print(f"\n🔍 Тест 5: Проверка доступа (обычный пользователь)...")
    try:
        new_hackathon = {
            "name": "Unauthorized Hackathon",
            "description": "Этот запрос должен быть отклонён",
        }
        
        response = requests.post(
            f"{API_URL}/api/hackathons",
            json=new_hackathon,
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        print(f"   Статус: {response.status_code}")
        
        if response.status_code == 403:
            print(f"   ✅ Доступ правильно запрещён для обычного пользователя")
            return True
        else:
            print(f"   ⚠️  Неожиданный статус: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        return False


def main():
    """Главная функция."""
    print("=" * 60)
    print("🧪 Тестирование админского функционала")
    print("=" * 60)
    
    # Проверка сервера
    if not test_health():
        print("\n❌ Тесты прерваны: сервер не доступен")
        sys.exit(1)
    
    # Тест публичного эндпоинта
    test_get_hackathons()
    
    # Получение токена
    print("\n" + "=" * 60)
    print("📝 Для тестирования админских эндпоинтов нужен токен с ролью 'admin'")
    print("=" * 60)
    
    token = input("\nВведите админский JWT токен (или нажмите Enter для пропуска админских тестов): ").strip()
    
    if not token:
        print("\n⚠️  Админские тесты пропущены (токен не предоставлен)")
        print("   Для полного тестирования:")
        print("   1. Добавьте ваш Telegram ID в ADMIN_TELEGRAM_IDS в config.py")
        print("   2. Получите код от бота (/login)")
        print("   3. Авторизуйтесь через POST /api/auth/bot-code")
        print("   4. Скопируйте токен и запустите скрипт снова")
        return
    
    # Проверка токена
    print("\n🔍 Проверка токена...")
    try:
        response = requests.get(
            f"{API_URL}/api/auth/debug-token",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            role = data.get("jwt_payload", {}).get("role", "participant")
            user_id = data.get("jwt_payload", {}).get("sub")
            print(f"   ✅ Токен валиден")
            print(f"   Пользователь: {user_id}")
            print(f"   Роль: {role}")
            
            if role != "admin":
                print(f"\n⚠️  ВНИМАНИЕ: Токен не имеет роли 'admin'!")
                print(f"   Админские тесты могут не пройти.")
                print(f"   Убедитесь, что ваш Telegram ID добавлен в ADMIN_TELEGRAM_IDS")
                
                choice = input("\nПродолжить тестирование? (y/n): ").strip().lower()
                if choice != 'y':
                    return
        else:
            print(f"   ❌ Токен невалиден: {response.json()}")
            return
    except Exception as e:
        print(f"   ❌ Ошибка проверки токена: {e}")
        return
    
    # Админские тесты
    results = []
    
    # Тест 2: Создание
    success, hackathon_id = test_create_hackathon(token)
    results.append(("Создание хакатона", success))
    
    if not success or not hackathon_id:
        print("\n❌ Не удалось создать хакатон. Остальные тесты пропущены.")
        return
    
    # Тест 3: Обновление
    success = test_update_hackathon(token, hackathon_id)
    results.append(("Обновление хакатона", success))
    
    # Тест 4: Удаление
    success = test_delete_hackathon(token, hackathon_id)
    results.append(("Удаление хакатона", success))
    
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
        print("🎉 Все админские тесты пройдены успешно!")
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

