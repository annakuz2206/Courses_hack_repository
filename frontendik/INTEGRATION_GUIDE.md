# 🔗 Руководство по интеграции Frontend + Backend

## ✅ Что уже сделано

### Backend (FastAPI)
- ✅ Сервер запущен на `http://localhost:8000`
- ✅ Swagger доступен: `http://localhost:8000/docs`
- ✅ API эндпоинты готовы к работе

### Frontend (React + Vite)
- ✅ API сервис обновлён (`src/services/api.js`)
- ✅ Добавлена авторизация через Telegram бот
- ✅ Компоненты AuthForm и AuthPage интегрированы
- ✅ Автоматическое заполнение кода из URL

## 🚀 Как запустить

### 1. Backend
```bash
cd Courses_hack_repository/backend_py
python main.py
```
Сервер запустится на `http://localhost:8000`

### 2. Frontend
```bash
cd frontendik
npm install
npm run dev
```
Фронтенд запустится на `http://localhost:5173`

### 3. Telegram Bot (опционально)
```bash
cd Courses_hack_repository/backend_py
python telegram_bot.py
```

## 🔐 Авторизация

### Способ 1: Через Telegram бота
1. Откройте бота в Telegram: `@very_cool_hack_bot`
2. Отправьте команду `/login`
3. Получите код (например: `ABC123`)
4. Перейдите по ссылке или введите код на сайте
5. Система автоматически авторизует вас

### Способ 2: Dev-режим (для разработки)
```javascript
// В консоли браузера
localStorage.setItem('access_token', 'your_token');
```

Или используйте тестовые ID:
- `u1` - Аня (Frontend)
- `u2` - Илья (Backend)
- `u3` - Катя (Designer)
- `u4` - Дима (ML Engineer)

## 📡 API Endpoints

### Авторизация
```javascript
// Авторизация через код от бота
POST /api/auth/bot-code
Body: { "code": "ABC123" }
Response: { "access_token": "...", "token_type": "bearer" }

// Проверка кода (без использования)
GET /api/auth/bot-code/validate/{code}
Response: { "valid": true, "message": "...", "user_name": "..." }

// Dev-логин
POST /api/auth/dev-login
Body: { "participantId": "u1" }
```

### Участники
```javascript
// Получить всех участников
GET /api/participants?hackathonId=h1&role=Frontend

// Мой профиль
GET /api/participants/me
Headers: { "Authorization": "Bearer <token>" }

// Обновить профиль
PUT /api/participants/me
Body: { "role": "Frontend", "skills": ["React", "TypeScript"], "bio": "..." }
```

### Команды
```javascript
// Получить все команды
GET /api/teams?hackathonId=h1

// Создать команду
POST /api/teams
Body: {
  "name": "AI Ninjas",
  "hackathonId": "h1",
  "captainId": "u1",
  "lookingForRoles": ["Backend"],
  "description": "..."
}
```

### Хакатоны
```javascript
// Получить все хакатоны
GET /api/hackathons?status=active

// Получить хакатон по ID
GET /api/hackathons/h1
```

### Свайпы и матчи
```javascript
// Сделать свайп
POST /api/swipe
Body: {
  "sourceType": "participant",
  "sourceId": "u1",
  "targetType": "team",
  "targetId": "t1",
  "direction": "right"
}
Response: { "match": true/false }

// Получить матчи
GET /api/matches?participantId=u1
```

## 🎯 User Flow

### 1. Авторизация
```
Пользователь → Telegram бот → Получает код → Вводит на сайте → JWT токен
```

### 2. Заполнение профиля
```
/questionnaire → Заполняет анкету → PUT /api/participants/me → Сохраняет данные
```

### 3. Выбор хакатона
```
/hackathons → GET /api/hackathons → Выбирает хакатон → Переходит к свайпам
```

### 4. Свайпы
```
/swipe → GET /api/participants или /api/teams → Свайпает → POST /api/swipe → Матч!
```

### 5. Матчи
```
/matches → GET /api/matches → Видит совпадения → Общается
```

## 🔧 Использование API в компонентах

### Пример: Авторизация
```javascript
import { authAPI, participantsAPI } from '../services/api';

const handleLogin = async (code) => {
  try {
    // Авторизация
    await authAPI.botCodeAuth(code);
    
    // Получаем профиль
    const profile = await participantsAPI.getMe();
    
    // Проверяем заполненность
    if (profile.role && profile.skills.length > 0) {
      navigate('/hackathons');
    } else {
      navigate('/questionnaire');
    }
  } catch (error) {
    console.error('Auth error:', error);
  }
};
```

### Пример: Получение участников
```javascript
import { participantsAPI } from '../services/api';

const loadParticipants = async () => {
  try {
    const data = await participantsAPI.getAll({ 
      hackathonId: 'h1',
      role: 'Frontend'
    });
    setParticipants(data.participants);
  } catch (error) {
    console.error('Error loading participants:', error);
  }
};
```

### Пример: Свайп
```javascript
import { swipeAPI } from '../services/api';

const handleSwipe = async (direction) => {
  try {
    const result = await swipeAPI.swipe(
      'participant',
      currentUserId,
      'team',
      targetTeamId,
      direction // 'right' или 'left'
    );
    
    if (result.match) {
      alert('Это матч! 🎉');
    }
  } catch (error) {
    console.error('Swipe error:', error);
  }
};
```

## 🐛 Troubleshooting

### CORS ошибки
Backend уже настроен для работы с `localhost:5173`. Если используете другой порт, добавьте его в `backend_py/main.py`:
```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",  # добавьте ваш порт
]
```

### Токен не сохраняется
Проверьте localStorage:
```javascript
console.log(localStorage.getItem('access_token'));
```

### 401 Unauthorized
Убедитесь, что токен передаётся в заголовках:
```javascript
Headers: { "Authorization": "Bearer <token>" }
```

### Backend не отвечает
Проверьте, что сервер запущен:
```bash
curl http://localhost:8000/health
# Должен вернуть: {"status":"ok"}
```

## 📝 Следующие шаги

### Интеграция компонентов
1. ✅ AuthPage - готов
2. ⏳ QuestionnairePage - подключить PUT /api/participants/me
3. ⏳ HackathonSelectionPage - подключить GET /api/hackathons
4. ⏳ SwipePage - подключить GET /api/participants, POST /api/swipe
5. ⏳ MatchesPage - подключить GET /api/matches
6. ⏳ CreateTeamPage - подключить POST /api/teams

### Дополнительные фичи
- [ ] Загрузка фотографий
- [ ] Real-time уведомления
- [ ] Чат между участниками
- [ ] Push-уведомления
- [ ] Фильтры и поиск

## 🎉 Готово!

Теперь фронтенд и бэкенд связаны. Можете тестировать авторизацию и начинать интегрировать остальные компоненты.

**Swagger UI для тестирования:** http://localhost:8000/docs
