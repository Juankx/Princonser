# CF Incubator

Sistema de gestión de incubadora de empresas para la Universidad de Cundinamarca.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

### Backend (Python/Django)
- API REST con Django y Django REST Framework
- Autenticación con JWT
- Base de datos PostgreSQL
- Documentación con Swagger/OpenAPI

### Frontend (React/TypeScript)
- Interfaz de usuario con React y Material-UI
- TypeScript para tipo seguro
- Formularios con Formik y validación con Yup
- Manejo de estado con React Context
- Enrutamiento con React Router

## Requisitos

### Backend
- Python 3.8+
- PostgreSQL
- pip

### Frontend
- Node.js 14+
- npm

## Instalación

### Backend
1. Crear y activar entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar base de datos:
```bash
python manage.py migrate
```

4. Iniciar servidor:
```bash
python manage.py runserver
```

### Frontend
1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Iniciar servidor de desarrollo:
```bash
npm start
```

## Características

- Autenticación de usuarios
- Gestión de perfiles
- Gestión de incubadoras
- Gestión de empresas
- Sistema de invitaciones
- Gestión de documentos
- Notificaciones
- Dashboard interactivo

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 