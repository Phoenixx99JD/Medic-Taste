# backend/controllers/

Reciben el `req`/`res` de Express, validan lo mínimo necesario, llaman a `models/` o `services/`, y devuelven la respuesta (JSON o error).

Archivos esperados (uno por recurso, espejo de `routes/`):
- `recipes.controller.js`
- `ingredients.controller.js`
- `planner.controller.js`
- `shoppingList.controller.js`
- `favorites.controller.js`
- `collections.controller.js`
- `stats.controller.js`

## Convención
No deben tener SQL directo (eso va en `models/`) ni lógica compleja de cálculo (eso va en `services/`). Su trabajo es orquestar y responder.
