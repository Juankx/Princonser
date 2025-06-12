from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from .. import schemas, models, auth
from ..database import get_db

router = APIRouter(
    prefix="/representatives",
    tags=["representatives"]
)

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print(f"Intentando login con email: {form_data.username}")
    representative = auth.authenticate_representative(db, form_data.username, form_data.password)
    if not representative:
        print("Autenticación fallida")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print(f"Autenticación exitosa para: {representative.email}")
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": representative.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": representative.id,
            "email": representative.email
        }
    }

@router.post("/", response_model=schemas.RepresentativeResponse)
def create_representative(representative: schemas.RepresentativeCreate, db: Session = Depends(get_db)):
    # Verificar si el email ya existe
    db_representative = db.query(models.Representative).filter(models.Representative.email == representative.email).first()
    if db_representative:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Crear nuevo representante
    hashed_password = auth.get_password_hash(representative.password)
    db_representative = models.Representative(
        full_name=representative.full_name,
        birth_date=representative.birth_date,
        country=representative.country,
        email=representative.email,
        phone=representative.phone,
        hashed_password=hashed_password
    )
    db.add(db_representative)
    db.commit()
    db.refresh(db_representative)
    return db_representative

@router.get("/me", response_model=schemas.DashboardResponse)
def get_representative_dashboard(
    current_representative: models.Representative = Depends(auth.get_current_active_representative),
    db: Session = Depends(get_db)
):
    # Obtener todos los datos del dashboard
    children = db.query(models.Child).filter(models.Child.representative_id == current_representative.id).all()
    products = db.query(models.Product).filter(models.Product.representative_id == current_representative.id).all()
    invitations = db.query(models.Invitation).filter(models.Invitation.sender_id == current_representative.id).all()
    
    return {
        "representative": current_representative,
        "children": children,
        "products": products,
        "invitations": invitations
    }

@router.put("/me", response_model=schemas.RepresentativeResponse)
def update_representative(
    representative: schemas.RepresentativeBase,
    current_representative: models.Representative = Depends(auth.get_current_active_representative),
    db: Session = Depends(get_db)
):
    # Actualizar datos del representante
    for key, value in representative.dict().items():
        setattr(current_representative, key, value)
    
    db.commit()
    db.refresh(current_representative)
    return current_representative 