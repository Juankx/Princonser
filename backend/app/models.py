from sqlalchemy import Boolean, Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from .database import Base

class Representative(Base):
    __tablename__ = "representatives"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    birth_date = Column(Date)
    country = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Relaciones
    children = relationship("Child", back_populates="representative")
    products = relationship("Product", back_populates="owner")
    invitations = relationship("Invitation", back_populates="sender")

class Child(Base):
    __tablename__ = "children"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    birth_date = Column(Date)
    country = Column(String)
    representative_id = Column(Integer, ForeignKey("representatives.id"))
    
    # Relación con el representante
    representative = relationship("Representative", back_populates="children")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    stock = Column(Integer)
    is_active = Column(Boolean, default=True)
    representative_id = Column(Integer, ForeignKey("representatives.id"))
    
    # Relación con el representante que compró el producto
    owner = relationship("Representative", back_populates="products")

class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    is_used = Column(Boolean, default=False)
    created_at = Column(Date)
    used_at = Column(Date, nullable=True)
    sender_id = Column(Integer, ForeignKey("representatives.id"))
    
    # Relación con el representante que envió la invitación
    sender = relationship("Representative", back_populates="invitations")
