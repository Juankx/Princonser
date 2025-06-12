# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import representative, child, products, invite
from .database import create_tables

# Crear las tablas al iniciar
create_tables()

app = FastAPI(
    title="CF Incubator API",
    description="API para el sistema de gestión de CF Incubator",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta raíz
@app.get("/")
async def root():
    return {
        "message": "Bienvenido a la API de CF Incubator",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Incluir rutas
app.include_router(representative.router, prefix="/api")
app.include_router(child.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(invite.router, prefix="/api")
