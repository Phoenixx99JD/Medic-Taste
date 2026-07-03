# backend/config/

Configuración de conexión a servicios externos.

- `db.js` → crea el pool de conexiones a MySQL (usando `mysql2/promise`) leyendo credenciales desde `.env`.

Si más adelante agregas otro servicio (ej. almacenamiento de imágenes en la nube), su configuración también va aquí.
