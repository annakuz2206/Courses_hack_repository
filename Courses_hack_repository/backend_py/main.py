"""
Главный файл приложения FastAPI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Импортируем роутеры
from routers import auth, participants, teams, swipe, matches, hackathons, admin

app = FastAPI(title="ITAM Hackathon Team Matching MVP")

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://localhost:5174",  # Vite dev server (alternative port)
        "http://localhost:8080",  # Vue dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:8080",
        # Добавьте сюда ваш production URL когда будет готов
        # "https://your-frontend-domain.com",
    ],
    
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (GET, POST, PUT, DELETE и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Подключаем роутеры
app.include_router(auth.router)
app.include_router(participants.router)
app.include_router(teams.router)
app.include_router(swipe.router)
app.include_router(matches.router)
app.include_router(hackathons.router)
app.include_router(admin.router)


@app.get("/health")
def healthcheck() -> dict:
    """Проверка здоровья сервиса."""
    return {"status": "ok"}


# Чтобы можно было запускать как `python main.py`
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
