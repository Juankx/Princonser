from app.create_test_user import create_test_user
from app.database import create_tables

if __name__ == "__main__":
    print("Creando tablas...")
    create_tables()
    print("Creando usuario de prueba...")
    create_test_user() 