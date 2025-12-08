"""
Роутеры для работы с участниками.
"""

from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends
from models import (
    Participant,
    ParticipantsResponse,
    UpdateParticipantRequest,
)
from storage import participants
from dependencies import get_current_participant

router = APIRouter(prefix="/api/participants", tags=["participants"])


@router.get("", response_model=ParticipantsResponse)
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


@router.get("/me", response_model=Participant)
def get_my_profile(
    current: Participant = Depends(get_current_participant),
) -> Participant:
    """
    Получить профиль текущего авторизованного участника (по JWT).
    ВАЖНО: Этот роут должен быть ДО /{participant_id}, иначе "me" будет интерпретироваться как ID.
    """
    return current


@router.get("/{participant_id}", response_model=Participant)
def get_participant(participant_id: str) -> Participant:
    p = next((p for p in participants if p.id == participant_id), None)
    if p is None:
        raise HTTPException(status_code=404, detail="Участник не найден")
    return p


@router.put("/me", response_model=Participant)
def update_my_profile(
    body: UpdateParticipantRequest,
    current: Participant = Depends(get_current_participant),
) -> Participant:
    """
    Обновить профиль текущего участника.
    Регистрация только через Telegram, поэтому здесь только редактирование.
    ВАЖНО: Этот роут должен быть ДО /{participant_id}, иначе "me" будет интерпретироваться как ID.
    """
    # Небольшая валидация
    if body.skills is not None and len(body.skills) == 0:
        raise HTTPException(
            status_code=400, detail="Список skills не может быть пустым"
        )

    # Находим объект в списке и обновляем
    idx = next((i for i, p in enumerate(participants) if p.id == current.id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Участник не найден")

    updated = participants[idx].copy(update=body.model_dump(exclude_unset=True))
    participants[idx] = updated
    return updated

