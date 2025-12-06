from typing import List, Literal, Optional
import hmac
import hashlib
import os
import time

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt


app = FastAPI(title="ITAM Hackathon Team Matching MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer_scheme = HTTPBearer()


class Participant(BaseModel):
    id: str
    name: str
    age: int
    role: str
    skills: List[str]
    bio: str
    hackathonId: str
    experienceHackathons: int
    telegram: Optional[str] = None


class Team(BaseModel):
    id: str
    name: str
    hackathonId: str
    captainId: str
    lookingForRoles: List[str] = []
    description: str = ""


class SwipeRequest(BaseModel):
    sourceType: Literal["participant", "team"]
    sourceId: str
    targetType: Literal["participant", "team"]
    targetId: str
    direction: Literal["right", "left"]


class SwipeResponse(BaseModel):
    match: bool


participants: List[Participant] = [
    Participant(
        id="u1",
        name="Аня",
        age=21,
        role="Frontend",
        skills=["React", "TypeScript", "Tailwind"],
        bio="Ищу команду для web-проекта, люблю красивый UI.",
        hackathonId="h1",
        experienceHackathons=2,
    ),
    Participant(
        id="u2",
        name="Илья",
        age=23,
        role="Backend",
        skills=["Node.js", "PostgreSQL", "Docker"],
        bio="Могу быстро поднять API и БД, хочу попробовать новую идею.",
        hackathonId="h1",
        experienceHackathons=3,
    ),
    Participant(
        id="u3",
        name="Катя",
        age=20,
        role="Designer",
        skills=["Figma", "UX", "Design Systems"],
        bio="Делаю интерфейсы понятными. Хочу в команду с сильным тех-стеком.",
        hackathonId="h1",
        experienceHackathons=1,
    ),
    Participant(
        id="u4",
        name="Дима",
        age=22,
        role="ML Engineer",
        skills=["Python", "PyTorch", "ML"],
        bio="Интересуют AI/ML задачки, могу быстро собрать прототип модели.",
        hackathonId="h1",
        experienceHackathons=4,
    ),
]


class ParticipantsResponse(BaseModel):
    participants: List[Participant]


swipes: List[dict] = []
matches_cache: List[dict] = []


teams: List[Team] = [
    Team(
        id="t1",
        name="AI Ninjas",
        hackathonId="h1",
        captainId="u2",
        lookingForRoles=["Frontend", "Designer"],
        description="Делаем AI-сервиса для студентов, ищем фронта и дизайнера.",
    ),
    Team(
        id="t2",
        name="Frontend Wizards",
        hackathonId="h1",
        captainId="u1",
        lookingForRoles=["Backend"],
        description="Сильный фронт, нужен бэкендер для API и базы.",
    ),
]


class TelegramAuthPayload(BaseModel):
    """
    Payload, который фронт присылает после Telegram Login Widget
    См. https://core.telegram.org/widgets/login
    """

    id: int
    first_name: str
    last_name: Optional[str] = None
    username: Optional[str] = None
    photo_url: Optional[str] = None
    auth_date: int
    hash: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "CHANGE_ME_TELEGRAM_BOT_TOKEN")
JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME_JWT_SECRET")
JWT_ALG = "HS256"
JWT_TTL_SECONDS = 60 * 60 * 12


@app.get("/health")
def healthcheck() -> dict:
    return {"status": "ok"}


def _build_telegram_check_string(data: TelegramAuthPayload) -> str:
    fields = {
        "auth_date": str(data.auth_date),
        "first_name": data.first_name,
        "id": str(data.id),
        "last_name": data.last_name,
        "photo_url": data.photo_url,
        "username": data.username,
    }
    parts = [f"{k}={v}" for k, v in fields.items() if v is not None]
    parts.sort()
    return "\n".join(parts)


def _verify_telegram_auth(data: TelegramAuthPayload) -> bool:
    """
    Проверка подписи от Telegram по инструкции:
    https://core.telegram.org/widgets/login#checking-authorization
    """
    if TELEGRAM_BOT_TOKEN.startswith("CHANGE_ME_"):
        return False

    check_string = _build_telegram_check_string(data)
    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    calculated_hash = hmac.new(
        secret_key, msg=check_string.encode(), digestmod=hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(calculated_hash, data.hash)


def _issue_jwt(user_id: str) -> str:
    now = int(time.time())
    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + JWT_TTL_SECONDS,
        "role": "participant",
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


@app.post("/api/auth/telegram", response_model=AuthResponse)
def auth_telegram(body: TelegramAuthPayload) -> AuthResponse:
    if not _verify_telegram_auth(body):
        raise HTTPException(status_code=401, detail="Некорректная подпись Telegram")

    user_id = f"tg_{body.id}"
    existing = next((p for p in participants if p.id == user_id), None)

    if existing is None:
        new_participant = Participant(
            id=user_id,
            name=body.first_name,
            age=0,
            role="",
            skills=[],
            bio="",
            hackathonId="",
            experienceHackathons=0,
        )
        participants.append(new_participant)

    token = _issue_jwt(user_id)
    return AuthResponse(access_token=token)


class DevLoginRequest(BaseModel):
    """
    DEV-эндпоинт для быстрого получения JWT без Telegram.
    НЕ для production, только для локальной отладки.
    """

    participantId: str


@app.post("/api/auth/dev-login", response_model=AuthResponse)
def dev_login(body: DevLoginRequest) -> AuthResponse:
    """
    Выдаёт JWT для существующего участника без проверки Telegram.
    Сделано только для удобства разработки и тестирования.
    """
    participant = next((p for p in participants if p.id == body.participantId), None)
    if participant is None:
        raise HTTPException(status_code=404, detail="Участник не найден")

    token = _issue_jwt(participant.id)
    return AuthResponse(access_token=token)


@app.get("/api/auth/debug-token")
def debug_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """
    DEV: посмотреть, что лежит внутри текущего JWT и какие id есть в participants.
    Помогает отлаживать авторизацию.
    """
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Token decode error: {exc}")

    return {
        "jwt_payload": payload,
        "participant_ids": [p.id for p in participants],
    }


def _get_current_participant(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> Participant:
    """
    Достаём участника из JWT в заголовке Authorization: Bearer <token>.
    Используем только для тех эндпоинтов, где нужна авторизация участника.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Токен истёк")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Некорректный токен")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Некорректный токен (нет sub)")

    participant = next((p for p in participants if p.id == user_id), None)
    if participant is None:
        raise HTTPException(status_code=404, detail="Участник не найден")

    return participant


@app.get("/api/participants", response_model=ParticipantsResponse)
def get_participants(
    hackathonId: Optional[str] = None,
    role: Optional[str] = None,
    skill: Optional[str] = None,
) -> ParticipantsResponse:
    """
    Получить список участников с простыми фильтрами:
    - hackathonId: только участники конкретного хакатона
    - role: фильтр по роли
    - skill: участники, у которых в skills есть указанный навык (регистр игнорируется)
    """
    result = participants

    if hackathonId is not None:
        result = [p for p in result if p.hackathonId == hackathonId]

    if role is not None:
        result = [p for p in result if p.role.lower() == role.lower()]

    if skill is not None:
        s = skill.lower()
        result = [
            p
            for p in result
            if any(skill_item.lower() == s for skill_item in p.skills)
        ]

    return ParticipantsResponse(participants=result)


@app.get("/api/participants/{participant_id}", response_model=Participant)
def get_participant(participant_id: str) -> Participant:
    p = next((p for p in participants if p.id == participant_id), None)
    if p is None:
        raise HTTPException(status_code=404, detail="Участник не найден")
    return p


@app.get("/api/participants/me", response_model=Participant)
def get_my_profile(
    current: Participant = Depends(_get_current_participant),
) -> Participant:
    """
    Получить профиль текущего авторизованного участника (по JWT).
    """
    return current


class UpdateParticipantRequest(BaseModel):
    role: Optional[str] = None
    skills: Optional[List[str]] = None
    bio: Optional[str] = None
    hackathonId: Optional[str] = None
    experienceHackathons: Optional[int] = None
    telegram: Optional[str] = None


@app.put("/api/participants/me", response_model=Participant)
def update_my_profile(
    body: UpdateParticipantRequest,
    current: Participant = Depends(_get_current_participant),
) -> Participant:
    """
    Обновить профиль текущего участника.
    Регистрация только через Telegram, поэтому здесь только редактирование.
    """
    if body.skills is not None and len(body.skills) == 0:
        raise HTTPException(
            status_code=400, detail="Список skills не может быть пустым"
        )

    idx = next((i for i, p in enumerate(participants) if p.id == current.id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Участник не найден")

    updated = participants[idx].copy(update=body.model_dump(exclude_unset=True))
    participants[idx] = updated
    return updated


class TeamsResponse(BaseModel):
    teams: List[Team]


class CreateTeamRequest(BaseModel):
    name: str
    hackathonId: str
    captainId: str
    lookingForRoles: List[str] = []
    description: str = ""


class TeamResponse(BaseModel):
    team: Team


@app.get("/api/teams", response_model=TeamsResponse)
def get_teams(
    hackathonId: Optional[str] = None,
    lookingForRole: Optional[str] = None,
) -> TeamsResponse:
    """
    Получить список команд с фильтрами:
    - hackathonId: команды конкретного хакатона
    - lookingForRole: команды, в которых в lookingForRoles есть указанная роль
    """
    result = teams

    if hackathonId is not None:
        result = [t for t in result if t.hackathonId == hackathonId]

    if lookingForRole is not None:
        r = lookingForRole.lower()
        result = [
            t
            for t in result
            if any(role_item.lower() == r for role_item in t.lookingForRoles)
        ]

    return TeamsResponse(teams=result)


@app.get("/api/teams/{team_id}", response_model=Team)
def get_team(team_id: str) -> Team:
    t = next((t for t in teams if t.id == team_id), None)
    if t is None:
        raise HTTPException(status_code=404, detail="Команда не найдена")
    return t


@app.post("/api/teams", response_model=TeamResponse, status_code=201)
def create_team(body: CreateTeamRequest) -> TeamResponse:
    captain = next((p for p in participants if p.id == body.captainId), None)
    if captain is None:
        raise HTTPException(status_code=404, detail="Капитан (captainId) не найден")

    new_id = f"t{len(teams) + 1}"

    team = Team(
        id=new_id,
        name=body.name,
        hackathonId=body.hackathonId,
        captainId=body.captainId,
        lookingForRoles=body.lookingForRoles,
        description=body.description,
    )
    teams.append(team)
    return TeamResponse(team=team)


@app.post("/api/swipe", response_model=SwipeResponse)
def swipe(body: SwipeRequest) -> SwipeResponse:
    """
    Универсальный свайп участник↔команда:
    - sourceType/sourceId свайпает targetType/targetId.
    - Матч есть, когда есть взаимный right-свайп между participant и team.
    """
    if {body.sourceType, body.targetType} != {"participant", "team"}:
        raise HTTPException(
            status_code=400,
            detail="Ожидается свайп между participant и team",
        )

    if body.sourceType == "participant":
        if not any(p.id == body.sourceId for p in participants):
            raise HTTPException(status_code=404, detail="Участник (sourceId) не найден")
    else:
        if not any(t.id == body.sourceId for t in teams):
            raise HTTPException(status_code=404, detail="Команда (sourceId) не найдена")

    if body.targetType == "participant":
        if not any(p.id == body.targetId for p in participants):
            raise HTTPException(status_code=404, detail="Участник (targetId) не найден")
    else:
        if not any(t.id == body.targetId for t in teams):
            raise HTTPException(status_code=404, detail="Команда (targetId) не найдена")

    swipes.append(
        {
            "fromType": body.sourceType,
            "fromId": body.sourceId,
            "toType": body.targetType,
            "toId": body.targetId,
            "direction": body.direction,
        }
    )

    is_match = False
    if body.direction == "right":
        reciprocal = next(
            (
                s
                for s in swipes
                if s["direction"] == "right"
                and s["fromType"] == body.targetType
                and s["fromId"] == body.targetId
                and s["toType"] == body.sourceType
                and s["toId"] == body.sourceId
            ),
            None,
        )
        is_match = reciprocal is not None

        if is_match:
            if body.sourceType == "participant":
                participant_id = body.sourceId
                team_id = body.targetId
            else:
                participant_id = body.targetId
                team_id = body.sourceId

            key = (participant_id, team_id)
            already = any(
                m["participantId"] == participant_id and m["teamId"] == team_id
                for m in matches_cache
            )
            if not already:
                matches_cache.append(
                    {
                        "participantId": participant_id,
                        "teamId": team_id,
                    }
                )

    return SwipeResponse(match=is_match)


class Match(BaseModel):
    participantId: str
    team: Team


class MatchesResponse(BaseModel):
    matches: List[Match]


@app.get("/api/matches", response_model=MatchesResponse)
def get_matches(
    participantId: Optional[str] = None,
    teamId: Optional[str] = None,
) -> MatchesResponse:
    """
    Возвращает список матчей:
    - если передан participantId → все команды, с которыми есть матч
    - если передан teamId → все участники, с которыми есть матч
    """
    if participantId and teamId:
        raise HTTPException(
            status_code=400,
            detail="Нужно передать либо participantId, либо teamId, но не оба",
        )

    result: List[Match] = []

    if participantId:
        team_ids = [m["teamId"] for m in matches_cache if m["participantId"] == participantId]
        team_objs = [t for t in teams if t.id in team_ids]
        result = [Match(participantId=participantId, team=t) for t in team_objs]
    elif teamId:
        participant_ids = [
            m["participantId"] for m in matches_cache if m["teamId"] == teamId
        ]
        team_obj = next((t for t in teams if t.id == teamId), None)
        if team_obj is None:
            raise HTTPException(status_code=404, detail="Команда не найдена")
        result = [
            Match(participantId=p_id, team=team_obj) for p_id in participant_ids
        ]
    else:
        result = []

    return MatchesResponse(matches=result)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


