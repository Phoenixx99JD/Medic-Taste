# backend/routes/

Definición de endpoints. Cada archivo declara las URLs de un recurso y qué función del controller maneja cada una. No contienen lógica de negocio.

Archivos esperados:
- `recipes.routes.js` → `/api/recipes` (CRUD, búsqueda, escalado de porciones).
- `ingredients.routes.js` → `/api/ingredients`.
- `planner.routes.js` → `/api/planner` (menú semanal, macros por día/semana).
- `shoppingList.routes.js` → `/api/shopping-list`.
- `favorites.routes.js` → `/api/favorites`.
- `collections.routes.js` → `/api/collections`.
- `stats.routes.js` → `/api/stats` (dashboard, registro de acciones).

## Convención
```js
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
```
