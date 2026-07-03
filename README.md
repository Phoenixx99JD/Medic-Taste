# TasteFlow — Planificador de Menús Semanales

Planificador nutricional que genera menús semanales con recetas balanceadas.

## Requisitos

- **Node.js** (v18+)
- **MySQL** (v8+)
- **Python 3** (para servir el frontend)

## Setup

```bash
# 1. Clonar el repo
git clone <repo-url>
cd tasteflow

# 2. Crear la base de datos
mysql -u root -p < database/schema.sql

# 3. (Opcional) Cargar datos de ejemplo
mysql -u root -p tasteflow < database/seed.sql

# 4. Configurar credenciales en backend/.env
cp backend/.env.example backend/.env   # si existe, si no editarlo directo
# Editar DB_USER, DB_PASSWORD, DB_NAME según tu MySQL

# 5. Instalar dependencias del backend
cd backend && npm install
```

## Iniciar

```bash
# Terminal 1 — Backend (API en puerto 3000)
cd backend && npm start

# Terminal 2 — Frontend (en puerto 8080)
cd frontend && python3 -m http.server 8080
```

Abrir [http://localhost:8080](http://localhost:8080)

## Ver usuarios registrados

```bash
mysql -u root -p tasteflow -e "SELECT id, name, email, created_at FROM users;"
```

## Detener todo

```bash
# Detener backend
pkill -f "node server.js"

# Detener MySQL
sudo systemctl stop mysql
```

## Estructura

```
tasteflow/
├── frontend/     → HTML, CSS, JS vanilla
├── backend/      → API REST con Node/Express
└── database/     → Scripts SQL (schema + seed)
```
