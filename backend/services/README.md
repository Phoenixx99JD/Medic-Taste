# backend/services/

Lógica de negocio que va más allá de un CRUD simple. Los controllers llaman a estos servicios cuando la tarea requiere cálculos o combinar datos de varios models.

Archivos esperados:
- `nutritionService.js` → suma macronutrientes de una receta (según ingredientes y cantidades) y agrega totales por día/semana.
- `suggestionService.js` → dado un listado de ingredientes disponibles, sugiere recetas que se puedan preparar (o que falten pocos ingredientes).
- `shoppingListService.js` → toma el menú de la semana, junta todos los ingredientes necesarios y los agrupa por categoría (Carnes, Verduras, Lácteos...).
- `pdfService.js` → genera el PDF del menú semanal (con `pdfkit`).

## Convención
Reciben datos ya obtenidos (o los piden a `models/`), hacen el procesamiento, y devuelven un resultado listo para responder al cliente.
