"""
Роутер для матчей.
"""

from typing import Optional, List
from fastapi import APIRouter, HTTPException
from models import Match, MatchesResponse
from storage import teams, matches_cache

router = APIRouter(prefix="/api/matches", tags=["matches"])


@router.get("", response_model=MatchesResponse)
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
        # В этом случае удобно вернуть матчи с участниками как Match, где participantId = id участника
        # а team — сама команда
        team_obj = next((t for t in teams if t.id == teamId), None)
        if team_obj is None:
            raise HTTPException(status_code=404, detail="Команда не найдена")
        result = [
            Match(participantId=p_id, team=team_obj) for p_id in participant_ids
        ]
    else:
        # ничего не передали
        result = []

    return MatchesResponse(matches=result)

