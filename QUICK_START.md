# 🚀 Быстрый старт

## ✅ Что запущено

- **Backend**: http://localhost:8000 (FastAPI)
- **Frontend**: http://localhost:5174 (React + Vite)
- **Swagger**: http://localhost:8000/docs

## 🔐 Тестовая авторизация

### Вариант 1: Dev-режим (быстро)
Откройте консоль браузера на http://localhost:5174 и выполните:
```javascript
// Используйте API для dev-логина
fetch('http://localhost:8000/api/auth/dev-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ participantId: 'u1' })
})
.then(r => r.json())
.then(data => {
  localStorage.setItem('access_token', data.access_token);
  window.location.href = '/hackathons';
});
```

### Вариант 2: Через Telegram бота
1. Откройте бота: https://t.me/very_cool_hack_bot
2. Отправьте `/login`
3. Скопируйте код
4. Введите на сайте

### Тестовые пользователи
- `u1` - Аня (Frontend, React/TypeScript)
- `u2` - Илья (Backend, Node.js/Python)
- `u3` - Катя (Designer, Figma/UX)
- `u4` - Дима (ML Engineer, Python/PyTorch)

## 📡 Основные API эндпоинты

```bash
# Авторизация
POST /api/auth/bot-code          # Вход через код от бота
POST /api/auth/dev-login         # Dev-вход

# Профиль
GET  /api/participants/me        # Мой профиль
PUT  /api/participants/me        # Обновить профиль

# Хакатоны
GET  /api/hackathons             # Список хакатонов
GET  /api/hackathons/{id}        # Детали хакатона

# Участники и команды
GET  /api/participants           # Список участников
GET  /api/teams                  # Список команд
POST /api/teams                  # Создать команду

# Свайпы
POST /api/swipe                  # Сделать свайп
GET  /api/matches                # Мои матчи
```

## 🎯 Что дальше?

1. Откройте http://localhost:5174
2. Авторизуйтесь (используйте dev-режим)
3. Заполните анкету (если нужно)
4. Выберите хакатон
5. Начните свайпать!

## 🔧 Остановка серверов

Backend и Frontend запущены в фоновом режиме. Чтобы остановить:
- Используйте команду остановки процессов в IDE
- Или закройте терминалы

## 📚 Документация

- **Полная интеграция**: см. `INTEGRATION_GUIDE.md`
- **Backend API**: http://localhost:8000/docs (Swagger)
- **Backend README**: `Courses_hack_repository/backend_py/README.md`
- **Frontend README**: `frontendik/README.md`
