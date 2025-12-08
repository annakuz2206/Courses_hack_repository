# План рефакторинга Frontend

## Новая структура:
```
src/
├── pages/           # Страницы приложения
│   ├── AuthPage.jsx
│   ├── ProfilePage.jsx
│   ├── HackathonsPage.jsx
│   ├── SwipePage.jsx
│   ├── MatchesPage.jsx
│   └── MyTeamPage.jsx
├── components/      # Переиспользуемые компоненты
│   ├── SwipeCard.jsx
│   ├── Modal.jsx
│   └── TabMenu.jsx
├── context/         # Context API для стейта
│   └── AppContext.jsx
└── App.jsx

```

## Изменения по ТЗ:

### 1. Авторизация (AuthPage)
- Простое поле ввода кода
- Мок-логика: любой код пускает дальше

### 2. Профиль (ProfilePage)
- Имя, Ник (read-only), Роль, Слайдер уверенности (0-100%), Навыки, О себе
- БЕЗ галочки "Есть команда"
- Кнопка "Сохранить" → Список хакатонов

### 3. Список хакатонов (HackathonsPage)
- Карточки с картинкой, названием, датами
- Клик → Модалка с выбором:
  - "Я ищу команду" → SwipePage
  - "Создать команду" → Форма → MyTeamPage (капитан)

### 4. Внутренний интерфейс (Табы)
- **SwipePage**: Tinder-механика (свайп влево/вправо)
- **MatchesPage**: Список взаимных лайков
- **MyTeamPage**: 
  - Нет команды → Кнопка "Создать"
  - Есть команда → Список участников (капитан может удалять, участник может выйти)

## Что удаляем:
- AdminPanel (не нужна)
- TeamStatus (логика меняется)
- Settings (заменяется на ProfilePage)
- Search (не в ТЗ)
- Chat (не в ТЗ)
- CardDetails (упрощаем)

## Что оставляем/переделываем:
- AuthForm → AuthPage
- Questionnaire → ProfilePage
- HackathonSelection → HackathonsPage
- Feed → SwipePage
- MatchList → MatchesPage
- TeamCreation → часть MyTeamPage
