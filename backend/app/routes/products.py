from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Product, Representative
from ..schemas import ProductCreate, ProductResponse
from ..auth import get_current_active_representative

router = APIRouter(
    prefix="/products",
    tags=["products"]
)

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate,
    current_representative: Representative = Depends(get_current_active_representative),
    db: Session = Depends(get_db)
):
    """
    Registra un nuevo producto comprado por el representante
    """
    db_product = Product(
        **product.dict(),
        representative_id=current_representative.id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/", response_model=List[ProductResponse])
def get_products(
    current_representative: Representative = Depends(get_current_active_representative),
    db: Session = Depends(get_db)
):
    """
    Obtiene la lista de productos comprados por el representante
    """
    products = db.query(Product).filter(
        Product.representative_id == current_representative.id
    ).all()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    current_representative: Representative = Depends(get_current_active_representative),
    db: Session = Depends(get_db)
):
    """
    Obtiene los detalles de un producto específico
    """
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.representative_id == current_representative.id
    ).first()
    
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductCreate,
    current_representative: Representative = Depends(get_current_active_representative),
    db: Session = Depends(get_db)
):
    """
    Actualiza los detalles de un producto
    """
    db_product = db.query(Product).filter(
        Product.id == product_id,
        Product.representative_id == current_representative.id
    ).first()
    
    if db_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    current_representative: Representative = Depends(get_current_active_representative),
    db: Session = Depends(get_db)
):
    """
    Elimina un producto
    """
    db_product = db.query(Product).filter(
        Product.id == product_id,
        Product.representative_id == current_representative.id
    ).first()
    
    if db_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    db.delete(db_product)
    db.commit()
    return None
