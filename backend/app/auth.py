from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from . import models, schemas
from .database import get_db

# Configuración de seguridad
SECRET_KEY = "tu_clave_secreta_aqui"  # En producción, usar una clave segura y almacenarla en variables de entorno
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/representatives/token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_representative(db: Session, email: str):
    return db.query(models.Representative).filter(models.Representative.email == email).first()

def authenticate_representative(db: Session, email: str, password: str):
    print(f"Buscando representante con email: {email}")
    representative = get_representative(db, email)
    if not representative:
        print("Representante no encontrado")
        return False
    print("Representante encontrado, verificando contraseña")
    if not verify_password(password, representative.hashed_password):
        print("Contraseña incorrecta")
        return False
    print("Autenticación exitosa")
    return representative

async def get_current_representative(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.Representative:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    representative = get_representative(db, email=email)
    if representative is None:
        raise credentials_exception
    return representative

async def get_current_active_representative(
    current_representative: models.Representative = Depends(get_current_representative)
) -> models.Representative:
    if not current_representative.is_active:
        raise HTTPException(status_code=400, detail="Inactive representative")
    return current_representative
