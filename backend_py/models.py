"""
Pydantic модели для API.
"""

from typing import List, Literal, Optional
from pydantic import BaseModel


class Participant(BaseModel):
    id: str
    name: str
    age: int
    role: str
    skills: List[str]
    bio: str
    hackathonId: str
    experienceHackathons: int


class Team(BaseModel):
    id: str
    name: str
    hackathonId: str
    captainId: str  # id участника-капитана
    lookingForRoles: List[str] = []  # какие роли ищут
    description: str = ""


class SwipeRequest(BaseModel):
    sourceType: Literal["participant", "team"]
    sourceId: str
    targetType: Literal["participant", "team"]
    targetId: str
    direction: Literal["right", "left"]


class SwipeResponse(BaseModel):
    match: bool


class ParticipantsResponse(BaseModel):
    participants: List[Participant]


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


class DevLoginRequest(BaseModel):
    """
    DEV-эндпоинт для быстрого получения JWT без Telegram.
    НЕ для production, только для локальной отладки.
    """

    participantId: str


class BotAuthRequest(BaseModel):
    """
    Запрос на авторизацию через код от Telegram бота.
    Пользователь получает код в боте командой /login и вводит его на сайте.
    """

    code: str


class CodeValidationResponse(BaseModel):
    """Ответ на проверку кода (без использования)."""
    valid: bool
    message: str
    user_name: Optional[str] = None


class UpdateParticipantRequest(BaseModel):
    role: Optional[str] = None
    skills: Optional[List[str]] = None
    bio: Optional[str] = None
    hackathonId: Optional[str] = None
    experienceHackathons: Optional[int] = None


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


class Match(BaseModel):
    participantId: str
    team: Team


class MatchesResponse(BaseModel):
    matches: List[Match]


class Hackathon(BaseModel):
    id: str
    name: str
    description: str = ""
    startDate: Optional[str] = None  # ISO format
    endDate: Optional[str] = None  # ISO format
    location: Optional[str] = None
    maxTeamSize: int = 5
    status: Literal["upcoming", "active", "finished"] = "upcoming"


class HackathonsResponse(BaseModel):
    hackathons: List[Hackathon]


class CreateHackathonRequest(BaseModel):
    name: str
    description: str = ""
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    location: Optional[str] = None
    maxTeamSize: int = 5
    status: Literal["upcoming", "active", "finished"] = "upcoming"


class UpdateHackathonRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    location: Optional[str] = None
    maxTeamSize: Optional[int] = None
    status: Optional[Literal["upcoming", "active", "finished"]] = None


class HackathonResponse(BaseModel):
    hackathon: Hackathon

