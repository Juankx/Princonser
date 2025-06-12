from datetime import date
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Representative
from .auth import get_password_hash

def create_test_user():
    db = SessionLocal()
    try:
        # Verificar si el usuario ya existe
        existing_user = db.query(Representative).filter(Representative.email == "admin@example.com").first()
        if existing_user:
            print("El usuario de prueba ya existe")
            return

        # Crear nuevo usuario
        test_user = Representative(
            full_name="Admin User",
            birth_date=date(1990, 1, 1),
            country="Colombia",
            email="admin@example.com",
            phone="1234567890",
            hashed_password=get_password_hash("admin123"),
            is_active=True
        )
        
        db.add(test_user)
        db.commit()
        print("Usuario de prueba creado exitosamente")
    except Exception as e:
        print(f"Error al crear usuario de prueba: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user() 