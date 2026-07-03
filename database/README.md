# database/

Scripts SQL para MySQL Workbench.

- `schema.sql` → creación de la base de datos `tasteflow` y todas sus tablas con relaciones (recetas, ingredientes, planificador, favoritos, colecciones, estadísticas).
- `seed.sql` → datos de prueba para poblar la base de datos durante el desarrollo (recetas de ejemplo, ingredientes comunes).
- `tasteflow.mwb` → (opcional) archivo de modelo visual de MySQL Workbench, si prefieres diseñar el diagrama ER gráficamente antes de exportar el SQL.

## Uso
1. Abrir MySQL Workbench.
2. Ejecutar `schema.sql` para crear la base y las tablas.
3. (Opcional) Ejecutar `seed.sql` para tener datos con los que probar el frontend/backend.
