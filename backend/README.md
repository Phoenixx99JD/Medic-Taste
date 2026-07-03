# backend/

API REST construida con Node.js + Express, siguiendo el patrón MVC.

- `server.js` → punto de entrada, monta middlewares y rutas.
- `.env` → variables de entorno (credenciales de MySQL, puerto). No subir a git.
- `config/` → configuración de conexión a la base de datos.
- `routes/` → definición de endpoints (URLs + método HTTP), delegan a controllers.
- `controllers/` → reciben el request, llaman a los models/services y devuelven la respuesta.
- `models/` → consultas SQL a la base de datos (una clase/módulo por tabla principal).
- `services/` → lógica de negocio que no es un simple CRUD (cálculo de macros, generación de PDF, motor de sugerencias, agrupación de lista de compras).
- `middlewares/` → funciones intermedias (manejo de errores, validación de requests).

## Flujo de una petición
`routes/` → `controllers/` → `models/` (o `services/` si hay lógica extra) → respuesta JSON.

## Instalación
```
npm install
npm start
```
