from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import secrets

from ..database import get_db
from ..models import Representative, Invitation
from ..schemas import InvitationResponse, InvitationCreate
from ..auth import get_current_active_representative

router = APIRouter(
    prefix="/invites",
    tags=["invites"]
)

def generate_invitation_code():
    """Genera un código de invitación único"""
    return secrets.token_urlsafe(8)

@router.post("/", response_model=InvitationResponse)
async def create_invitation(
    current_representative: Representative = Depends(get_current_active_representative),
    db: Session = Depends(get_db)
):
    """
    Crea una nueva invitación para compartir
    """
    # Generar código único
    code = generate_invitation_code()
    
    # Crear la invitación
    invitation = Invitation(
        code=code,
        created_at=datetime.now(),
        sender_id=current_representative.id
    )
    
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    
    return invitation

@router.get("/", response_model=List[InvitationResponse])
async def get_invitations(
    current_representative: Representative = Depends(get_current_active_representative),
    db: Session = Depends(get_db)
):
    """
    Obtiene la lista de invitaciones creadas por el representante
    """
    invitations = db.query(Invitation).filter(
        Invitation.sender_id == current_representative.id
    ).all()
    
    return invitations

@router.post("/validate/{code}", response_model=InvitationResponse)
async def validate_invitation(
    code: str,
    db: Session = Depends(get_db)
):
    """
    Valida un código de invitación
    """
    invitation = db.query(Invitation).filter(
        Invitation.code == code,
        Invitation.is_used == False
    ).first()
    
    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Código de invitación inválido o ya utilizado"
        )
    
    return invitation

@router.post("/use/{code}", response_model=InvitationResponse)
async def use_invitation(
    code: str,
    current_representative: Representative = Depends(get_current_active_representative),
    db: Session = Depends(get_db)
):
    """
    Marca una invitación como utilizada
    """
    invitation = db.query(Invitation).filter(
        Invitation.code == code,
        Invitation.is_used == False
    ).first()
    
    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Código de invitación inválido o ya utilizado"
        )
    
    # Marcar como utilizada
    invitation.is_used = True
    invitation.used_at = datetime.now()
    
    db.commit()
    db.refresh(invitation)
    
    return invitation
