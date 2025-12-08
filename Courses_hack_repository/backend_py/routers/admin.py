"""
Роутеры для административных функций.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from models import Participant
from storage import participants, teams, hackathons
from dependencies import get_current_admin
import io
import csv

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/analytics")
def get_analytics(
    hackathonId: Optional[str] = None,
    admin: Participant = Depends(get_current_admin),
) -> dict:
    """
    Получить аналитику по хакатону.
    Возвращает статистику по участникам и командам.
    """
    # Фильтруем участников по хакатону
    filtered_participants = participants
    if hackathonId:
        filtered_participants = [p for p in participants if p.hackathonId == hackathonId]
    
    # Фильтруем команды по хакатону
    filtered_teams = teams
    if hackathonId:
        filtered_teams = [t for t in teams if t.hackathonId == hackathonId]
    
    # Подсчитываем статистику
    total_participants = len(filtered_participants)
    participants_without_team = len([p for p in filtered_participants if not p.teamId])
    total_teams = len(filtered_teams)
    
    # Полные команды (предполагаем, что команда полная если в ней >= 3 участников)
    complete_teams = 0
    for team in filtered_teams:
        team_members = [p for p in filtered_participants if p.teamId == team.id]
        if len(team_members) >= 3:
            complete_teams += 1
    
    return {
        "totalParticipants": total_participants,
        "participantsWithoutTeam": participants_without_team,
        "totalTeams": total_teams,
        "completeTeams": complete_teams,
    }


@router.get("/export/participants")
def export_participants(
    hackathonId: Optional[str] = None,
    admin: Participant = Depends(get_current_admin),
):
    """
    Экспорт участников в CSV формате.
    """
    # Фильтруем участников по хакатону
    filtered_participants = participants
    if hackathonId:
        filtered_participants = [p for p in participants if p.hackathonId == hackathonId]
    
    # Создаем CSV в памяти
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Заголовки
    writer.writerow(['ID', 'Имя', 'Возраст', 'Роль', 'Навыки', 'Опыт хакатонов', 'ID команды', 'ID хакатона'])
    
    # Данные
    for p in filtered_participants:
        writer.writerow([
            p.id,
            p.name,
            p.age,
            p.role,
            ', '.join(p.skills),
            p.experienceHackathons,
            p.teamId or '',
            p.hackathonId,
        ])
    
    # Возвращаем CSV
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=participants_{hackathonId or 'all'}.csv"}
    )


@router.get("/export/teams")
def export_teams(
    hackathonId: Optional[str] = None,
    admin: Participant = Depends(get_current_admin),
):
    """
    Экспорт команд в CSV формате.
    """
    # Фильтруем команды по хакатону
    filtered_teams = teams
    if hackathonId:
        filtered_teams = [t for t in teams if t.hackathonId == hackathonId]
    
    # Создаем CSV в памяти
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Заголовки
    writer.writerow(['ID', 'Название', 'Описание', 'ID капитана', 'Ищут роли', 'ID хакатона'])
    
    # Данные
    for t in filtered_teams:
        writer.writerow([
            t.id,
            t.name,
            t.description,
            t.captainId,
            ', '.join(t.lookingForRoles),
            t.hackathonId,
        ])
    
    # Возвращаем CSV
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=teams_{hackathonId or 'all'}.csv"}
    )
