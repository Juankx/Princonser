from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from .. import auth

router = APIRouter(
    prefix="/api/children",
    tags=["children"]
)

@router.get("/", response_model=List[schemas.ChildResponse])
def get_children(
    db: Session = Depends(get_db),
    current_representative: models.Representative = Depends(auth.get_current_active_representative)
):
    children = db.query(models.Child).filter(
        models.Child.representative_id == current_representative.id
    ).all()
    return children

@router.post("/", response_model=schemas.ChildResponse)
def create_child(
    child: schemas.ChildCreate,
    db: Session = Depends(get_db),
    current_representative: models.Representative = Depends(auth.get_current_active_representative)
):
    db_child = models.Child(**child.dict(), representative_id=current_representative.id)
    db.add(db_child)
    db.commit()
    db.refresh(db_child)
    return db_child

@router.put("/{child_id}", response_model=schemas.ChildResponse)
def update_child(
    child_id: int,
    child: schemas.ChildCreate,
    db: Session = Depends(get_db),
    current_representative: models.Representative = Depends(auth.get_current_active_representative)
):
    db_child = db.query(models.Child).filter(
        models.Child.id == child_id,
        models.Child.representative_id == current_representative.id
    ).first()
    if not db_child:
        raise HTTPException(status_code=404, detail="Child not found")
    
    for key, value in child.dict(exclude_unset=True).items():
        setattr(db_child, key, value)
    
    db.commit()
    db.refresh(db_child)
    return db_child

@router.delete("/{child_id}")
def delete_child(
    child_id: int,
    db: Session = Depends(get_db),
    current_representative: models.Representative = Depends(auth.get_current_active_representative)
):
    db_child = db.query(models.Child).filter(
        models.Child.id == child_id,
        models.Child.representative_id == current_representative.id
    ).first()
    if not db_child:
        raise HTTPException(status_code=404, detail="Child not found")
    
    db.delete(db_child)
    db.commit()
    return {"message": "Child deleted successfully"} 