"""
Роутер для свайпов.
"""

from fastapi import APIRouter, HTTPException
from models import SwipeRequest, SwipeResponse
from storage import participants, teams, swipes, matches_cache

router = APIRouter(prefix="/api/swipe", tags=["swipe"])


@router.post("", response_model=SwipeResponse)
def swipe(body: SwipeRequest) -> SwipeResponse:
    """
    Универсальный свайп участник↔команда:
    - sourceType/sourceId свайпает targetType/targetId.
    - Матч есть, когда есть взаимный right-свайп между participant и team.
    """
    # Валидация типов
    if {body.sourceType, body.targetType} != {"participant", "team"}:
        raise HTTPException(
            status_code=400,
            detail="Ожидается свайп между participant и team",
        )

    # Проверяем существование сущностей
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

    # Сохраняем свайп
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
            # определяем кто участник, кто команда
            if body.sourceType == "participant":
                participant_id = body.sourceId
                team_id = body.targetId
            else:
                participant_id = body.targetId
                team_id = body.sourceId

            # сохраняем матч participant↔team, если ещё не было
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

