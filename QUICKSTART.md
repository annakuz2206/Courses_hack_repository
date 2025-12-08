# 🚀 Быстрый старт

## Шаг 1: Установка зависимостей

```bash
cd frontend
npm install
```

## Шаг 2: Запуск

```bash
npm run dev
```

Откроется на `http://localhost:5174`

## Шаг 3: Убедитесь что backend запущен

В другом терминале:

```bash
cd itam_hack
python main.py
```

Backend должен быть на `http://localhost:8000`

## Шаг 4: Тест

1. Откройте `http://localhost:5174`
2. Введите ID: `u1`
3. Нажмите "Войти"
4. Заполните анкету
5. Выберите роль
6. Начните свайпать!

## 🎨 Добавление стилей

### Вариант 1: Обычный CSS

Создайте файл `ComponentName.css` рядом с компонентом:

```css
/* AuthForm.css */
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.auth-form input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}
```

Импортируйте в компонент:

```jsx
import './AuthForm.css';
```

### Вариант 2: CSS Modules

Переименуйте в `ComponentName.module.css`:

```css
/* AuthForm.module.css */
.form {
  max-width: 400px;
}
```

Импортируйте:

```jsx
import styles from './AuthForm.module.css';

<div className={styles.form}>...</div>
```

### Вариант 3: Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Настройте `tailwind.config.js`:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Создайте `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Импортируйте в `main.jsx`:

```jsx
import './index.css';
```

Используйте:

```jsx
<div className="max-w-md mx-auto p-4">
  <input className="w-full px-4 py-2 border rounded" />
</div>
```

### Вариант 4: Styled Components

```bash
npm install styled-components
```

```jsx
import styled from 'styled-components';

const Form = styled.form`
  max-width: 400px;
  margin: 0 auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
`;

<Form>
  <Input type="text" />
</Form>
```

### Вариант 5: Material-UI

```bash
npm install @mui/material @emotion/react @emotion/styled
```

```jsx
import { TextField, Button } from '@mui/material';

<TextField label="ID участника" />
<Button variant="contained">Войти</Button>
```

## 📦 Полезные библиотеки

### UI компоненты
```bash
npm install @mui/material @emotion/react @emotion/styled  # Material-UI
npm install antd                                          # Ant Design
npm install react-bootstrap bootstrap                    # Bootstrap
npm install @chakra-ui/react @emotion/react              # Chakra UI
```

### Иконки
```bash
npm install react-icons                                   # Все иконки
npm install @mui/icons-material                          # Material Icons
```

### Анимации
```bash
npm install framer-motion                                # Анимации
npm install react-spring                                 # Spring анимации
```

### Формы
```bash
npm install react-hook-form                              # Управление формами
npm install yup                                          # Валидация
```

### Утилиты
```bash
npm install clsx                                         # Условные классы
npm install date-fns                                     # Работа с датами
```

## 🎯 Рекомендуемый стек для быстрого старта

```bash
# Tailwind для стилей
npm install -D tailwindcss postcss autoprefixer

# Иконки
npm install react-icons

# Формы
npm install react-hook-form

# Утилиты
npm install clsx date-fns
```

## 📝 Пример стилизации компонента

### До (голый HTML):

```jsx
const AuthForm = () => {
  return (
    <div>
      <h1>Вход</h1>
      <form>
        <input type="text" placeholder="ID" />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};
```

### После (с Tailwind):

```jsx
const AuthForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Вход
        </h1>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="ID участника"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};
```

## 🔥 Готовые темы

Можете скопировать стили из `frontendik/` если нужен cyberpunk дизайн:

```bash
# Скопировать все CSS файлы
cp ../frontendik/src/components/*.css src/components/

# Или выборочно
cp ../frontendik/src/components/AuthForm.css src/components/
```

## ✅ Готово!

Теперь у вас есть:
- ✅ Рабочий React проект
- ✅ Все компоненты
- ✅ API интеграция
- ✅ Роутинг
- ✅ Логика работы
- 🎨 Готово к стилизации!

Выберите подход к стилизации и начинайте творить! 🚀
