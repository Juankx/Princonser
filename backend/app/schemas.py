from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True

class RepresentativeBase(BaseModel):
    full_name: str
    birth_date: date
    country: str
    email: EmailStr
    phone: Optional[str] = None

class RepresentativeCreate(RepresentativeBase):
    password: str

class RepresentativeResponse(RepresentativeBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class ChildBase(BaseModel):
    full_name: str
    birth_date: date
    country: str

class ChildCreate(ChildBase):
    pass

class ChildResponse(ChildBase):
    id: int
    representative_id: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: int

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    is_active: bool
    representative_id: int

    class Config:
        from_attributes = True

class InvitationBase(BaseModel):
    code: str

class InvitationCreate(InvitationBase):
    pass

class InvitationResponse(InvitationBase):
    id: int
    is_used: bool
    created_at: date
    used_at: Optional[date]
    sender_id: int

    class Config:
        from_attributes = True

# Esquemas para el dashboard
class DashboardResponse(BaseModel):
    representative: RepresentativeResponse
    children: List[ChildResponse]
    products: List[ProductResponse]
    invitations: List[InvitationResponse]

    class Config:
        from_attributes = True
