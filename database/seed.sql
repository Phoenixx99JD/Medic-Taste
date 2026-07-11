USE tasteflow;

-- Usuario de prueba (omitir si ya existe)
-- INSERT INTO users (name, email, password) VALUES
-- ('Usuario Demo', 'demo@tasteflow.com', '$2a$10$dummyhashparaeldemo');

-- =====================================================
-- Ingredientes locales de Barranquilla (precios COP)
-- =====================================================

-- Verduras y verduleria (IDs 1-7)
INSERT INTO ingredients (name, category, price_per_unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit) VALUES
('Tomate chonto (Libra)',             'Verduras', 2900.00,  18,  0.9,  3.9, 0.2, NULL),
('Cebolla cabezona blanca (Libra)',   'Verduras', 2500.00,  40,  1.1,  9.3, 0.1, NULL),
('Cebolla junca / larga (Manojo)',    'Verduras', 1800.00,  32,  1.1,  7.0, 0.1, NULL),
('Pimenton rojo (Libra)',             'Verduras', 3200.00,  31,  1.0,  6.0, 0.3, NULL),
('Ajo (Cabeza unidad)',               'Verduras',  800.00, 149,  6.4, 33.0, 0.5, 40),
('Cilantro (Manojo)',                 'Verduras', 1200.00,  23,  2.1,  3.7, 0.5, NULL),
('Aji topito (Libra)',                'Verduras', 3500.00,  40,  2.0,  8.8, 0.4, NULL);

-- Tuberculos y platanos (IDs 8-12)
INSERT INTO ingredients (name, category, price_per_unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit) VALUES
('Yuca limpia (Libra)',               'Tuberculos y platanos', 2000.00, 160, 1.4, 38.0, 0.3, NULL),
('Platano verde (Unidad)',            'Tuberculos y platanos', 1300.00,  89, 1.1, 23.0, 0.3, 180),
('Platano maduro (Unidad)',           'Tuberculos y platanos', 1400.00, 122, 1.4, 32.0, 0.4, 150),
('Papa pastusa (Libra)',              'Tuberculos y platanos', 2200.00,  77, 2.1, 17.0, 0.1, NULL),
('Nhame espino (Libra)',              'Tuberculos y platanos', 2800.00, 118, 1.5, 28.0, 0.1, NULL);

-- Lacteos y autoctonos (IDs 13-16)
INSERT INTO ingredients (name, category, price_per_unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit) VALUES
('Queso costeno duro (Libra)',        'Lacteos', 12500.00, 370, 24.0,  2.0, 30.0, NULL),
('Suero costeno (Pote 250g)',         'Lacteos',  5200.00, 220,  6.0,  4.0, 20.0, 250),
('Leche entera (Litro en bolsa)',     'Lacteos',  4100.00,  61,  3.2,  4.8, 3.3, 1000),
('Mantequilla (Barra 125g)',          'Lacteos',  3800.00, 717,  0.9,  0.1, 81.0, 125);

-- Carnes y embutidos (IDs 17-23)
INSERT INTO ingredients (name, category, price_per_unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit) VALUES
('Carne de res para asar / pulpa (Libra)',   'Carnes', 15500.00, 250, 26.0, 0.0, 15.0, NULL),
('Carne de res molida (Libra)',              'Carnes', 14800.00, 254, 17.2, 0.0, 20.0, NULL),
('Pechuga de pollo (Libra)',                 'Carnes',  9900.00, 165, 31.0, 0.0,  3.6, NULL),
('Muslos de pollo (Libra)',                  'Carnes',  7500.00, 209, 17.2, 0.0, 15.4, NULL),
('Salchicha manguera Zenu (Paquete x9)',     'Carnes',  9800.00, 260, 12.0, 2.0, 21.0, NULL),
('Butifarrasoledeña (Paquete x10 unidades)', 'Carnes',  7000.00, 230, 13.0, 1.0, 19.0, NULL),
('Carne de cerdo / pulpa (Libra)',           'Carnes', 12000.00, 242, 27.0, 0.0, 14.0, NULL);

-- Abarrotes y despensa (IDs 24-33)
INSERT INTO ingredients (name, category, price_per_unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit) VALUES
('Arroz blanco corriente (Kilo)',       'Abarrotes', 4800.00, 130, 2.7, 28.0, 0.3, NULL),
('Aceite vegetal de cocina (Botella 900ml)', 'Abarrotes', 8900.00, 884, 0.0, 0.0, 100.0, NULL),
('Frijol cabecita negra (Libra)',       'Abarrotes', 4500.00, 127, 8.7, 23.0, 0.5, NULL),
('Frijol zaragoza (Libra)',             'Abarrotes', 5200.00, 127, 8.7, 23.0, 0.5, NULL),
('Harina de maiz PAN (Kilo)',           'Abarrotes', 4900.00, 364, 6.0, 79.0, 1.5, NULL),
('Sal refisal (Paquete 1kg)',           'Abarrotes', 2100.00,   0, 0.0,  0.0, 0.0, NULL),
('Azucar incauca (Kilo)',              'Abarrotes', 4300.00, 387, 0.0, 100.0, 0.0, NULL),
('Cafe Sello Rojo (Bolsa 250g)',       'Abarrotes', 6500.00,   2, 0.1,  0.0, 0.0, NULL),
('Panela (Unidad bloque)',              'Abarrotes', 2200.00, 304, 0.3, 75.0, 0.1, NULL),
('Huevos AA (Panal x30 unidades)',      'Abarrotes', 16500.00, 155, 13.0, 1.1, 11.0, NULL);

-- Ingredientes extra requeridos por recetas (IDs 34-46, sin precio local)
INSERT INTO ingredients (name, category, price_per_unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit) VALUES
('Lechuga',         'Verduras',    NULL,  15,  1.4,  2.9, 0.2, NULL),
('Pasta',           'Granos',      NULL, 131,  5.0, 25.0, 1.1, NULL),
('Queso parmesano',  'Lacteos',     NULL, 431, 38.0,  4.1, 29.0, NULL),
('Aguacate',        'Verduras',    NULL, 160,  2.0,  8.5, 14.7, 150),
('Pan integral',    'Granos',      NULL, 247, 13.0, 41.0, 3.4, 35),
('Atun en lata',    'Pescados',    NULL, 198, 29.0,  0.0, 8.2, NULL),
('Lentejas',        'Legumbres',   NULL, 116,  9.0, 20.0, 0.4, NULL),
('Zanahoria',       'Verduras',    NULL,  41,  0.9,  9.6, 0.2, NULL),
('Manzana',         'Frutas',      NULL,  52,  0.3, 14.0, 0.2, NULL),
('Yogur natural',   'Lacteos',     NULL,  61,  3.5,  4.7, 3.3, NULL),
('Almendras',       'Frutos Secos', NULL, 579, 21.0, 22.0, 50.0, NULL),
('Miel',            'Endulzantes', NULL, 304,  0.3, 82.0, 0.0, NULL),
('Calabacin',       'Verduras',    NULL,  17,  1.2,  3.1, 0.3, NULL);

-- =====================================================
-- Recetas
-- =====================================================
INSERT INTO recipes (name, photo_url, description, servings, prep_time_minutes, diet_tags) VALUES
('Pollo con arroz',       'https://images.unsplash.com/photo-1724441980118-741eaf55b0f8?w=600&h=400&fit=crop', 'Pechuga de pollo salteada con arroz blanco y verduras', 4, 35, NULL),
('Ensalada Cesar',        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop', 'Ensalada clasica con pollo, lechuga, crutones y parmesano', 2, 20, NULL),
('Pasta al pesto',        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop', 'Pasta con salsa pesto casera y parmesano', 3, 25, 'vegano'),
('Tortilla de patatas',   'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop', 'Tortilla espanola clasica con huevo y patata', 4, 30, NULL),
('Batido de platano',     'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=400&fit=crop', 'Batido cremoso de platano con leche y miel', 1, 5, NULL),
('Ensalada de aguacate',  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Ensalada fresca con aguacate, tomate y cebolla', 2, 10, 'vegano'),
('Lentejas guisadas',     'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop', 'Lentejas con verduras y especias', 4, 45, NULL),
('Tostada de aguacate',   'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop', 'Pan integral con aguacate, tomate y huevo', 1, 10, NULL);

-- =====================================================
-- Ingredientes por receta
-- =====================================================

-- Receta 1: Pollo con arroz (19=Pechuga, 24=Arroz, 2=Cebolla, 5=Ajo, 25=Aceite, 29=Sal)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(1, 19, 400, 'g'), (1, 24, 300, 'g'), (1, 2, 100, 'g'),
(1,  5,  10, 'g'), (1, 25,  20, 'ml'), (1, 29,   5, 'g');

-- Receta 2: Ensalada Cesar (19=Pechuga, 34=Lechuga, 36=Parmesano, 25=Aceite, 29=Sal)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(2, 19, 200, 'g'), (2, 34, 200, 'g'), (2, 36,  50, 'g'),
(2, 25,  30, 'ml'), (2, 29,   3, 'g');

-- Receta 3: Pasta al pesto (35=Pasta, 36=Parmesano, 25=Aceite, 5=Ajo)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(3, 35, 300, 'g'), (3, 36,  40, 'g'), (3, 25,  40, 'ml'), (3,  5,  10, 'g');

-- Receta 4: Tortilla de patatas (33=Huevos, 35=Pasta, 2=Cebolla, 25=Aceite, 29=Sal)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(4, 33,   5, 'unidad'), (4, 35, 300, 'g'), (4,  2, 100, 'g'),
(4, 25,  40, 'ml'), (4, 29,   5, 'g');

-- Receta 5: Batido de platano (10=Platano maduro, 15=Leche, 45=Miel)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(5, 10,   2, 'unidad'), (5, 15, 250, 'ml'), (5, 45,  15, 'g');

-- Receta 6: Ensalada de aguacate (37=Aguacate, 1=Tomate, 2=Cebolla, 25=Aceite, 29=Sal)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(6, 37,   2, 'unidad'), (6,  1,   2, 'unidad'), (6,  2,  50, 'g'),
(6, 25,  15, 'ml'), (6, 29,   3, 'g');

-- Receta 7: Lentejas guisadas (40=Lentejas, 41=Zanahoria, 2=Cebolla, 5=Ajo, 25=Aceite, 29=Sal)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(7, 40, 400, 'g'), (7, 41, 100, 'g'), (7,  2, 100, 'g'),
(7,  5,  10, 'g'), (7, 25,  20, 'ml'), (7, 29,   5, 'g');

-- Receta 8: Tostada de aguacate (38=Pan integral, 37=Aguacate, 1=Tomate, 33=Huevos, 29=Sal)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(8, 38,   2, 'unidad'), (8, 37,   1, 'unidad'), (8,  1,   1, 'unidad'),
(8, 33,   2, 'unidad'), (8, 29,   2, 'g');

-- =====================================================
-- Pasos de receta
-- =====================================================

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(1, 1, 'Cortar la pechuga de pollo en cubos y sazonar con sal y ajo picado', NULL),
(1, 2, 'Calentar aceite en una sarten y dorar el pollo', 300),
(1, 3, 'Agregar la cebolla picada y cocinar hasta que este transparente', 180),
(1, 4, 'Anadir el arroz y el doble de agua caliente. Cocinar a fuego bajo', 1200),
(1, 5, 'Dejar reposar 5 minutos antes de servir', 300);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(2, 1, 'Cocinar el pollo a la plancha y cortar en tiras', 600),
(2, 2, 'Lavar y cortar la lechuga en trozos', NULL),
(2, 3, 'Mezclar la lechuga con el pollo y el parmesano rallado', NULL),
(2, 4, 'Alinar con aceite de oliva y sal al gusto', NULL);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(3, 1, 'Cocer la pasta en agua con sal segun instrucciones', 480),
(3, 2, 'Triturar albahaca (opcional), ajo, aceite y parmesano para el pesto', NULL),
(3, 3, 'Mezclar la pasta escurrida con el pesto caliente', NULL);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(4, 1, 'Pelar y cortar las patatas en rodajas finas', NULL),
(4, 2, 'Freir las patatas en abundante aceite hasta que esten tiernas', 600),
(4, 3, 'Batir los huevos en un bol grande con sal', NULL),
(4, 4, 'Mezclar las patatas escurridas con el huevo batido', NULL),
(4, 5, 'Cuajar la tortilla en una sarten por ambos lados', 240);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(5, 1, 'Pelar los platanos y trocearlos', NULL),
(5, 2, 'Licuar el platano con la leche y la miel hasta obtener una mezcla homogenea', 30),
(5, 3, 'Servir frio', NULL);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(6, 1, 'Cortar los aguacates y tomates en cubos', NULL),
(6, 2, 'Picar la cebolla finamente', NULL),
(6, 3, 'Mezclar todo y alinar con aceite de oliva y sal', NULL);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(7, 1, 'Lavar las lentejas y poner a remojo 30 minutos', 1800),
(7, 2, 'Sofreir cebolla y ajo picados en aceite', 180),
(7, 3, 'Agregar las lentejas, zanahoria picada y cubrir con agua', NULL),
(7, 4, 'Cocinar a fuego medio hasta que las lentejas esten tiernas', 1800),
(7, 5, 'Sazonar con sal y dejar reposar', 300);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(8, 1, 'Tostar el pan integral', 120),
(8, 2, 'Machacar el aguacate y extender sobre el pan', NULL),
(8, 3, 'Cortar el tomate en rodajas y colocar encima', NULL),
(8, 4, 'Freir los huevos y ponerlos sobre la tostada', 180),
(8, 5, 'Sazonar al gusto', NULL);

-- Favoritos
INSERT INTO favorites (user_id, recipe_id) VALUES (1, 1), (1, 3), (1, 6);

-- Colecciones
INSERT INTO collections (user_id, name) VALUES (1, 'Rapidas'), (1, 'Saludables'), (1, 'Cenas ligeras');
INSERT INTO collection_recipes (collection_id, recipe_id) VALUES
(1, 5), (1, 8),
(2, 2), (2, 6), (2, 7),
(3, 2), (3, 6);

-- Plan semanal
INSERT INTO meal_plan (user_id, recipe_id, plan_date, meal_type) VALUES
(1, 1, CURDATE(), 'almuerzo'),
(1, 4, CURDATE(), 'cena'),
(1, 5, CURDATE(), 'desayuno'),
(1, 8, CURDATE() + 1, 'desayuno'),
(1, 2, CURDATE() + 1, 'almuerzo'),
(1, 6, CURDATE() + 1, 'cena'),
(1, 3, CURDATE() + 2, 'almuerzo'),
(1, 7, CURDATE() + 2, 'cena');

-- Stats
INSERT INTO usage_stats (action_type, recipe_id) VALUES
('recipe_viewed', 1), ('recipe_viewed', 3), ('recipe_viewed', 1),
('plan_created', 1), ('recipe_cooked', 4);
