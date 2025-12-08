"""
Роутеры для работы с хакатонами.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from models import (
    Hackathon,
    HackathonsResponse,
    CreateHackathonRequest,
    UpdateHackathonRequest,
    HackathonResponse,
    Participant,
)
from storage import hackathons
from dependencies import get_current_admin

router = APIRouter(prefix="/api/hackathons", tags=["hackathons"])


@router.get("", response_model=HackathonsResponse)
def get_hackathons(
    status: Optional[str] = None,
) -> HackathonsResponse:
    """
    Получить список хакатонов с фильтрами:
    - status: фильтр по статусу (upcoming, active, finished)
    """
    result = hackathons

    if status is not None:
        result = [h for h in result if h.status == status]

    return HackathonsResponse(hackathons=result)


@router.get("/{hackathon_id}", response_model=Hackathon)
def get_hackathon(hackathon_id: str) -> Hackathon:
    """Получить информацию о конкретном хакатоне."""
    h = next((h for h in hackathons if h.id == hackathon_id), None)
    if h is None:
        raise HTTPException(status_code=404, detail="Хакатон не найден")
    return h


@router.post("", response_model=HackathonResponse, status_code=201)
def create_hackathon(
    body: CreateHackathonRequest,
    admin: Participant = Depends(get_current_admin),
) -> HackathonResponse:
    """
    Создать новый хакатон.
    Требуются права администратора.
    """
    # Проверяем, что ID не занят
    existing = next((h for h in hackathons if h.id == body.name.lower().replace(" ", "_")), None)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Хакатон с таким ID уже существует"
        )
    
    # Генерируем ID (в production лучше использовать UUID)
    new_id = f"h{len(hackathons) + 1}"
    
    hackathon = Hackathon(
        id=new_id,
        name=body.name,
        description=body.description,
        startDate=body.startDate,
        endDate=body.endDate,
        location=body.location,
        maxTeamSize=body.maxTeamSize,
        status=body.status,
    )
    hackathons.append(hackathon)
    
    print(f"✅ Создан новый хакатон: {hackathon.name} (id: {hackathon.id}) админом {admin.name}")
    
    return HackathonResponse(hackathon=hackathon)


@router.put("/{hackathon_id}", response_model=HackathonResponse)
def update_hackathon(
    hackathon_id: str,
    body: UpdateHackathonRequest,
    admin: Participant = Depends(get_current_admin),
) -> HackathonResponse:
    """
    Обновить информацию о хакатоне.
    Требуются права администратора.
    """
    h = next((h for h in hackathons if h.id == hackathon_id), None)
    if h is None:
        raise HTTPException(status_code=404, detail="Хакатон не найден")
    
    # Обновляем поля
    update_data = body.model_dump(exclude_unset=True)
    updated = h.model_copy(update=update_data)
    
    # Заменяем в списке
    idx = next((i for i, h in enumerate(hackathons) if h.id == hackathon_id), None)
    if idx is not None:
        hackathons[idx] = updated
    
    print(f"✅ Хакатон {hackathon_id} обновлён админом {admin.name}")
    
    return HackathonResponse(hackathon=updated)


@router.delete("/{hackathon_id}", status_code=204)
def delete_hackathon(
    hackathon_id: str,
    admin: Participant = Depends(get_current_admin),
) -> None:
    """
    Удалить хакатон.
    Требуются права администратора.
    """
    h = next((h for h in hackathons if h.id == hackathon_id), None)
    if h is None:
        raise HTTPException(status_code=404, detail="Хакатон не найден")
    
    hackathons.remove(h)
    
    print(f"✅ Хакатон {hackathon_id} удалён админом {admin.name}")
    
    return None

