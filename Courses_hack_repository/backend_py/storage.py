"""
Хранилище данных в памяти (MVP).
В production здесь будет работа с БД.
"""

from typing import List
from models import Participant, Team, Hackathon

# Участники
participants: List[Participant] = [
    # Администраторы
    Participant(
        id="super_admin_1",
        name="Администратор",
        age=30,
        role="admin",
        skills=["Управление", "Организация"],
        bio="Главный администратор системы",
        hackathonId="h1",
        experienceHackathons=10,
    ),
    # Хакатон h1
    Participant(
        id="u1",
        name="Аня",
        age=21,
        role="Frontend",
        skills=["React", "TypeScript", "Tailwind", "Next.js"],
        bio="Ищу команду для web-проекта, люблю красивый UI. Опыт в разработке SPA и мобильных приложений.",
        hackathonId="h1",
        experienceHackathons=2,
    ),
    Participant(
        id="u2",
        name="Илья",
        age=23,
        role="Backend",
        skills=["Node.js", "PostgreSQL", "Docker", "FastAPI", "Python"],
        bio="Могу быстро поднять API и БД, хочу попробовать новую идею. Специализируюсь на микросервисах.",
        hackathonId="h1",
        experienceHackathons=3,
    ),
    Participant(
        id="u3",
        name="Катя",
        age=20,
        role="Designer",
        skills=["Figma", "UX", "Design Systems", "Prototyping"],
        bio="Делаю интерфейсы понятными. Хочу в команду с сильным тех-стеком. Опыт в мобильном дизайне.",
        hackathonId="h1",
        experienceHackathons=1,
    ),
    Participant(
        id="u4",
        name="Дима",
        age=22,
        role="ML Engineer",
        skills=["Python", "PyTorch", "ML", "TensorFlow", "NLP"],
        bio="Интересуют AI/ML задачки, могу быстро собрать прототип модели. Работал с компьютерным зрением.",
        hackathonId="h1",
        experienceHackathons=4,
    ),
    Participant(
        id="u5",
        name="Максим",
        age=24,
        role="Fullstack",
        skills=["React", "Node.js", "MongoDB", "TypeScript", "GraphQL"],
        bio="Fullstack разработчик, могу закрыть и фронт и бэк. Ищу интересный проект для хакатона.",
        hackathonId="h1",
        experienceHackathons=5,
    ),
    Participant(
        id="u6",
        name="София",
        age=19,
        role="Frontend",
        skills=["Vue.js", "JavaScript", "CSS", "Webpack"],
        bio="Начинающий фронтенд разработчик, но очень мотивированная! Хочу получить опыт в команде.",
        hackathonId="h1",
        experienceHackathons=0,
    ),
    Participant(
        id="u7",
        name="Алексей",
        age=25,
        role="Backend",
        skills=["Go", "Kubernetes", "Redis", "Microservices"],
        bio="Backend разработчик с опытом в высоконагруженных системах. Ищу команду для масштабируемого проекта.",
        hackathonId="h1",
        experienceHackathons=6,
    ),
    Participant(
        id="u8",
        name="Мария",
        age=21,
        role="Designer",
        skills=["Figma", "Illustrator", "After Effects", "UI/UX"],
        bio="UI/UX дизайнер с опытом в брендинге. Создаю не только красивые, но и функциональные интерфейсы.",
        hackathonId="h1",
        experienceHackathons=2,
    ),
    # Хакатон h2
    Participant(
        id="u9",
        name="Дмитрий",
        age=26,
        role="ML Engineer",
        skills=["Python", "Scikit-learn", "Pandas", "Data Science"],
        bio="Data Scientist с опытом в аналитике и машинном обучении. Ищу команду для data-driven проекта.",
        hackathonId="h2",
        experienceHackathons=7,
    ),
    Participant(
        id="u10",
        name="Елена",
        age=22,
        role="Frontend",
        skills=["React", "Redux", "Sass", "Jest"],
        bio="Frontend разработчик, специализируюсь на сложных SPA. Люблю писать тесты и чистый код.",
        hackathonId="h2",
        experienceHackathons=3,
    ),
    Participant(
        id="u11",
        name="Иван",
        age=23,
        role="Backend",
        skills=["Java", "Spring Boot", "MySQL", "Kafka"],
        bio="Java разработчик с опытом в enterprise приложениях. Хочу попробовать что-то новое на хакатоне.",
        hackathonId="h2",
        experienceHackathons=4,
    ),
    Participant(
        id="u12",
        name="Ольга",
        age=20,
        role="Designer",
        skills=["Figma", "Sketch", "Principle", "User Research"],
        bio="UX дизайнер, фокус на пользовательском опыте. Провожу исследования и создаю прототипы.",
        hackathonId="h2",
        experienceHackathons=1,
    ),
]

# Команды
teams: List[Team] = [
    # Хакатон h1
    Team(
        id="t1",
        name="AI Ninjas",
        hackathonId="h1",
        captainId="u2",
        lookingForRoles=["Frontend", "Designer"],
        description="Делаем AI-сервиса для студентов, ищем фронта и дизайнера. У нас уже есть ML инженер и бэкендер.",
    ),
    Team(
        id="t2",
        name="Frontend Wizards",
        hackathonId="h1",
        captainId="u1",
        lookingForRoles=["Backend"],
        description="Сильный фронт, нужен бэкендер для API и базы. У нас два фронтенд разработчика.",
    ),
    Team(
        id="t3",
        name="Data Masters",
        hackathonId="h1",
        captainId="u4",
        lookingForRoles=["Frontend", "Backend"],
        description="Команда ML инженеров, работаем над data-driven решением. Нужны разработчики для интерфейса и API.",
    ),
    Team(
        id="t4",
        name="Startup Squad",
        hackathonId="h1",
        captainId="u5",
        lookingForRoles=["Designer"],
        description="Fullstack команда, делаем MVP для стартапа. Ищем дизайнера для создания UI/UX.",
    ),
    Team(
        id="t5",
        name="Code Warriors",
        hackathonId="h1",
        captainId="u7",
        lookingForRoles=["Frontend", "ML Engineer"],
        description="Backend команда с опытом в масштабируемых системах. Ищем фронтенд и ML для комплексного решения.",
    ),
    # Хакатон h2
    Team(
        id="t6",
        name="Innovation Lab",
        hackathonId="h2",
        captainId="u9",
        lookingForRoles=["Frontend", "Backend"],
        description="Data Science команда, работаем над инновационным решением. Нужны разработчики для реализации.",
    ),
    Team(
        id="t7",
        name="Design First",
        hackathonId="h2",
        captainId="u12",
        lookingForRoles=["Frontend", "Backend"],
        description="UX-фокус команда, у нас есть дизайнер. Ищем разработчиков для реализации наших идей.",
    ),
]

# Хакатоны
hackathons: List[Hackathon] = [
    Hackathon(
        id="h1",
        name="ITAM Hackathon 2024",
        description="Главный хакатон года от ITAM. Соревнуйтесь в создании инновационных решений для образования и бизнеса. Призы: 100,000₽ за первое место!",
        startDate="2024-03-15T10:00:00",
        endDate="2024-03-17T18:00:00",
        location="Москва, ITAM Campus",
        maxTeamSize=5,
        status="active",
    ),
    Hackathon(
        id="h2",
        name="AI Challenge 2024",
        description="Хакатон по искусственному интеллекту и машинному обучению. Создавайте AI-решения для реальных задач. Спонсоры: Yandex, Sber AI.",
        startDate="2024-04-20T09:00:00",
        endDate="2024-04-22T20:00:00",
        location="Онлайн",
        maxTeamSize=4,
        status="upcoming",
    ),
    Hackathon(
        id="h3",
        name="FinTech Innovation",
        description="Хакатон по финансовым технологиям. Разрабатывайте решения для банков, платежей и инвестиций. Призовой фонд: 200,000₽.",
        startDate="2024-02-10T10:00:00",
        endDate="2024-02-12T18:00:00",
        location="Санкт-Петербург",
        maxTeamSize=6,
        status="finished",
    ),
    Hackathon(
        id="h4",
        name="GreenTech Hackathon",
        description="Экологический хакатон. Создавайте технологии для защиты окружающей среды и устойчивого развития.",
        startDate="2024-05-01T08:00:00",
        endDate="2024-05-03T17:00:00",
        location="Москва",
        maxTeamSize=5,
        status="upcoming",
    ),
]

# Хранилище свайпов и матчей в памяти
swipes: List[dict] = []
matches_cache: List[dict] = []  # матчи участник↔команда

