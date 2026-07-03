# TasteFlow — Planificador de Menús Semanales

Estructura general del proyecto:

- `frontend/` → HTML, CSS y JS vanilla (sin librerías/frameworks).
- `backend/` → API REST con Node/Express.
- `database/` → Scripts SQL para MySQL Workbench.

## Cómo levantar el proyecto

1. Crear la base de datos con `database/schema.sql` en MySQL Workbench.
2. Configurar `backend/.env` con tus credenciales de MySQL.
3. `cd backend && npm install && npm start`
4. Abrir `frontend/index.html` (o servirlo con Live Server) apuntando a la API del backend.

## Orden sugerido de desarrollo

1. Base de datos (`database/schema.sql`)
2. Backend: modelos → controllers → routes
3. Frontend: services (fetch a la API) → components → pages
# Medic-Taste
