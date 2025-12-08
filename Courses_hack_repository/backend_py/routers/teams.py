"""
Роутеры для работы с командами.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException
from models import Team, TeamsResponse, CreateTeamRequest, TeamResponse
from storage import teams, participants

router = APIRouter(prefix="/api/teams", tags=["teams"])


@router.get("", response_model=TeamsResponse)
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


@router.get("/{team_id}", response_model=Team)
def get_team(team_id: str) -> Team:
    t = next((t for t in teams if t.id == team_id), None)
    if t is None:
        raise HTTPException(status_code=404, detail="Команда не найдена")
    return t


@router.post("", response_model=TeamResponse, status_code=201)
def create_team(body: CreateTeamRequest) -> TeamResponse:
    # Проверяем, что капитан существует
    captain = next((p for p in participants if p.id == body.captainId), None)
    if captain is None:
        raise HTTPException(status_code=404, detail="Капитан (captainId) не найден")

    # Простая генерация id (в реале лучше использовать UUID/БД)
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

