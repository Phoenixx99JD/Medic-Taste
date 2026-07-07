USE tasteflow;

-- Usuario de prueba
INSERT INTO users (name, email, password) VALUES
('Usuario Demo', 'demo@tasteflow.com', '$2a$10$dummyhashparaeldemo');

-- Ingredientes
INSERT INTO ingredients (name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit) VALUES
('Pechuga de pollo', 'Carnes', 165, 31.0, 0.0, 3.6, NULL),
('Arroz blanco', 'Granos', 130, 2.7, 28.0, 0.3, NULL),
('Tomate', 'Verduras', 18, 0.9, 3.9, 0.2, 100),
('Lechuga', 'Verduras', 15, 1.4, 2.9, 0.2, NULL),
('Cebolla', 'Verduras', 40, 1.1, 9.3, 0.1, NULL),
('Aceite de oliva', 'Aceites y Grasas', 884, 0.0, 0.0, 100.0, NULL),
('Sal', 'Condimentos', 0, 0.0, 0.0, 0.0, NULL),
('Pasta', 'Granos', 131, 5.0, 25.0, 1.1, NULL),
('Queso parmesano', 'Lácteos', 431, 38.0, 4.1, 29.0, NULL),
('Huevo', 'Lácteos', 155, 13.0, 1.1, 11.0, 55),
('Leche', 'Lácteos', 42, 3.4, 5.0, 1.0, NULL),
('Harina de trigo', 'Granos', 364, 10.0, 76.0, 1.0, NULL),
('Ajo', 'Verduras', 149, 6.4, 33.0, 0.5, NULL),
('Aguacate', 'Verduras', 160, 2.0, 8.5, 14.7, 150),
('Pan integral', 'Granos', 247, 13.0, 41.0, 3.4, 35),
('Atún en lata', 'Pescados', 198, 29.0, 0.0, 8.2, NULL),
('Lentejas', 'Legumbres', 116, 9.0, 20.0, 0.4, NULL),
('Zanahoria', 'Verduras', 41, 0.9, 9.6, 0.2, NULL),
('Plátano', 'Frutas', 89, 1.1, 23.0, 0.3, 120),
('Manzana', 'Frutas', 52, 0.3, 14.0, 0.2, NULL),
('Yogur natural', 'Lácteos', 61, 3.5, 4.7, 3.3, NULL),
('Almendras', 'Frutos Secos', 579, 21.0, 22.0, 50.0, NULL),
('Miel', 'Endulzantes', 304, 0.3, 82.0, 0.0, NULL),
('Pimiento rojo', 'Verduras', 31, 1.0, 6.0, 0.3, NULL),
('Calabacín', 'Verduras', 17, 1.2, 3.1, 0.3, NULL);

-- Recetas
INSERT INTO recipes (name, photo_url, description, servings, prep_time_minutes, diet_tags) VALUES
('Pollo con arroz', 'https://images.unsplash.com/photo-1724441980118-741eaf55b0f8?w=600&h=400&fit=crop', 'Pechuga de pollo salteada con arroz blanco y verduras', 4, 35, NULL),
('Ensalada César', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop', 'Ensalada clásica con pollo, lechuga, crutones y parmesano', 2, 20, NULL),
('Pasta al pesto', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop', 'Pasta con salsa pesto casera y parmesano', 3, 25, 'vegano'),
('Tortilla de patatas', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop', 'Tortilla española clásica con huevo y patata', 4, 30, NULL),
('Batido de plátano', 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=400&fit=crop', 'Batido cremoso de plátano con leche y miel', 1, 5, NULL),
('Ensalada de aguacate', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Ensalada fresca con aguacate, tomate y cebolla', 2, 10, 'vegano'),
('Lentejas guisadas', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop', 'Lentejas con verduras y especias', 4, 45, NULL),
('Tostada de aguacate', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop', 'Pan integral con aguacate, tomate y huevo', 1, 10, NULL);

-- Receta 1: Pollo con arroz
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(1, 1, 400, 'g'),
(1, 2, 300, 'g'),
(1, 5, 100, 'g'),
(1, 13, 10, 'g'),
(1, 6, 20, 'ml'),
(1, 7, 5, 'g');

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(1, 1, 'Cortar la pechuga de pollo en cubos y sazonar con sal y ajo picado', NULL),
(1, 2, 'Calentar aceite en una sartén y dorar el pollo', 300),
(1, 3, 'Agregar la cebolla picada y cocinar hasta que esté transparente', 180),
(1, 4, 'Añadir el arroz y el doble de agua caliente. Cocinar a fuego bajo', 1200),
(1, 5, 'Dejar reposar 5 minutos antes de servir', 300);

-- Receta 2: Ensalada César
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(2, 1, 200, 'g'),
(2, 4, 200, 'g'),
(2, 9, 50, 'g'),
(2, 6, 30, 'ml'),
(2, 7, 3, 'g');

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(2, 1, 'Cocinar el pollo a la plancha y cortar en tiras', 600),
(2, 2, 'Lavar y cortar la lechuga en trozos', NULL),
(2, 3, 'Mezclar la lechuga con el pollo y el parmesano rallado', NULL),
(2, 4, 'Aliñar con aceite de oliva y sal al gusto', NULL);

-- Receta 3: Pasta al pesto
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(3, 8, 300, 'g'),
(3, 9, 40, 'g'),
(3, 6, 40, 'ml'),
(3, 13, 10, 'g');

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(3, 1, 'Cocer la pasta en agua con sal según instrucciones', 480),
(3, 2, 'Triturar albahaca (opcional), ajo, aceite y parmesano para el pesto', NULL),
(3, 3, 'Mezclar la pasta escurrida con el pesto caliente', NULL);

-- Receta 4: Tortilla de patatas
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(4, 10, 5, 'unidad'),
(4, 8, 300, 'g'),
(4, 5, 100, 'g'),
(4, 6, 40, 'ml'),
(4, 7, 5, 'g');

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(4, 1, 'Pelar y cortar las patatas en rodajas finas', NULL),
(4, 2, 'Freír las patatas en abundante aceite hasta que estén tiernas', 600),
(4, 3, 'Batir los huevos en un bol grande con sal', NULL),
(4, 4, 'Mezclar las patatas escurridas con el huevo batido', NULL),
(4, 5, 'Cuajar la tortilla en una sartén por ambos lados', 240);

-- Receta 5: Batido de plátano
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(5, 19, 2, 'unidad'),
(5, 11, 250, 'ml'),
(5, 23, 15, 'g');

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(5, 1, 'Pelar los plátanos y trocearlos', NULL),
(5, 2, 'Licuar el plátano con la leche y la miel hasta obtener una mezcla homogénea', 30),
(5, 3, 'Servir frío', NULL);

-- Receta 6: Ensalada de aguacate
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(6, 14, 2, 'unidad'),
(6, 3, 2, 'unidad'),
(6, 5, 50, 'g'),
(6, 6, 15, 'ml'),
(6, 7, 3, 'g');

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(6, 1, 'Cortar los aguacates y tomates en cubos', NULL),
(6, 2, 'Picar la cebolla finamente', NULL),
(6, 3, 'Mezclar todo y aliñar con aceite de oliva y sal', NULL);

-- Receta 7: Lentejas guisadas
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(7, 17, 400, 'g'),
(7, 18, 100, 'g'),
(7, 5, 100, 'g'),
(7, 13, 10, 'g'),
(7, 6, 20, 'ml'),
(7, 7, 5, 'g');

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(7, 1, 'Lavar las lentejas y poner a remojo 30 minutos', 1800),
(7, 2, 'Sofreír cebolla y ajo picados en aceite', 180),
(7, 3, 'Agregar las lentejas, zanahoria picada y cubrir con agua', NULL),
(7, 4, 'Cocinar a fuego medio hasta que las lentejas estén tiernas', 1800),
(7, 5, 'Sazonar con sal y dejar reposar', 300);

-- Receta 8: Tostada de aguacate
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(8, 15, 2, 'unidad'),
(8, 14, 1, 'unidad'),
(8, 3, 1, 'unidad'),
(8, 10, 2, 'unidad'),
(8, 7, 2, 'g');

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(8, 1, 'Tostar el pan integral', 120),
(8, 2, 'Machacar el aguacate y extender sobre el pan', NULL),
(8, 3, 'Cortar el tomate en rodajas y colocar encima', NULL),
(8, 4, 'Freír los huevos y ponerlos sobre la tostada', 180),
(8, 5, 'Sazonar al gusto', NULL);

-- Favoritos
INSERT INTO favorites (user_id, recipe_id) VALUES (1, 1), (1, 3), (1, 6);

-- Colecciones
INSERT INTO collections (user_id, name) VALUES (1, 'Rápidas'), (1, 'Saludables'), (1, 'Cenas ligeras');
INSERT INTO collection_recipes (collection_id, recipe_id) VALUES
(1, 5), (1, 8),
(2, 2), (2, 6), (2, 7),
(3, 2), (3, 6);

-- Plan semanal (ejemplo)
INSERT INTO meal_plan (user_id, recipe_id, plan_date, meal_type) VALUES
(1, 1, CURDATE(), 'almuerzo'),
(1, 4, CURDATE(), 'cena'),
(1, 5, CURDATE(), 'desayuno'),
(1, 8, CURDATE() + 1, 'desayuno'),
(1, 2, CURDATE() + 1, 'almuerzo'),
(1, 6, CURDATE() + 1, 'cena'),
(1, 3, CURDATE() + 2, 'almuerzo'),
(1, 7, CURDATE() + 2, 'cena');

-- Stats de ejemplo
INSERT INTO usage_stats (action_type, recipe_id) VALUES
('recipe_viewed', 1), ('recipe_viewed', 3), ('recipe_viewed', 1),
('plan_created', 1), ('recipe_cooked', 4);
