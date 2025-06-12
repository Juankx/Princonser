# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import representative, child, products, invite
from .database import create_tables
import os

# Crear las tablas al iniciar
create_tables()

app = FastAPI(
    title="CF Incubator API",
    description="API para el sistema de gestión de CF Incubator",
    version="1.0.0"
)

# Configurar CORS
origins = [
    "http://localhost:3000",  # Frontend local
    "http://localhost:5173",  # Frontend Vite
    "https://cf-incubator.vercel.app",  # Frontend en Vercel
    "https://*.vercel.app",  # Cualquier subdominio de Vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
        "redoc": "/redoc",
        "status": "online"
    }

# Incluir rutas
app.include_router(representative.router, prefix="/api")
app.include_router(child.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(invite.router, prefix="/api")

# Configuración para Render
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
