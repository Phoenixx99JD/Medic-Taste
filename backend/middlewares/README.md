# backend/middlewares/

Funciones intermedias que se ejecutan antes de llegar al controller (o al final, para manejar errores).

Archivos esperados:
- `errorHandler.js` → middleware final de Express que captura errores y responde con un JSON consistente (`{ error: "mensaje" }`) y el status HTTP correcto.
- `validateRequest.js` → validaciones genéricas de body/params antes de llegar al controller (ej. campos requeridos presentes).

Se registran en `server.js` con `app.use(...)`.
