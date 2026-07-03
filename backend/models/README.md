# backend/models/

Acceso a datos: consultas SQL a MySQL usando el pool de `config/db.js`. Cada archivo representa una tabla o entidad principal.

Archivos esperados:
- `Recipe.js` → CRUD de recetas + joins con ingredientes y pasos.
- `Ingredient.js` → CRUD de ingredientes.
- `MealPlan.js` → inserciones/consultas del menú semanal.

## Convención
Cada método retorna directamente filas de MySQL (o las mapea a un objeto simple). No deben conocer nada de Express (`req`/`res`).
