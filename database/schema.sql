CREATE DATABASE IF NOT EXISTS tasteflow
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE tasteflow;

-- -----------------------------------------------------------
-- Usuarios
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  name                  VARCHAR(255) NOT NULL,
  email                 VARCHAR(255) NOT NULL UNIQUE,
  password              VARCHAR(255) NOT NULL,
  onboarding_completed  TINYINT(1)   NOT NULL DEFAULT 0,
  photo_url             VARCHAR(500) DEFAULT NULL,
  created_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Recetas
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipes (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  photo_url        VARCHAR(500) DEFAULT NULL,
  description      TEXT DEFAULT NULL,
  servings         INT NOT NULL DEFAULT 4,
  prep_time_minutes INT DEFAULT NULL,
  diet_tags        VARCHAR(255) DEFAULT NULL COMMENT 'comma-separated diet tags',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Ingredientes
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingredients (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(255) NOT NULL,
  category          VARCHAR(100) DEFAULT NULL,
  price_per_unit    DECIMAL(10,2) DEFAULT NULL COMMENT 'precio en COP por unidad de venta',
  calories_per_100g DECIMAL(8,2) DEFAULT NULL,
  protein_per_100g  DECIMAL(8,2) DEFAULT NULL,
  carbs_per_100g    DECIMAL(8,2) DEFAULT NULL,
  fat_per_100g      DECIMAL(8,2) DEFAULT NULL,
  grams_per_unit    DECIMAL(8,2) DEFAULT NULL COMMENT 'peso en gramos de 1 unidad (para unidad/ml)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_ingredients_category ON ingredients(category);

-- -----------------------------------------------------------
-- Ingredientes de cada receta (join table)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id      INT NOT NULL,
  ingredient_id  INT NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  unit           VARCHAR(50) NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_id),
  FOREIGN KEY (recipe_id)     REFERENCES recipes(id)     ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Pasos de cada receta
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipe_steps (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id     INT NOT NULL,
  step_number   INT NOT NULL,
  instruction   TEXT NOT NULL,
  timer_seconds INT DEFAULT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_steps_recipe ON recipe_steps(recipe_id);

-- -----------------------------------------------------------
-- Planificador semanal
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS meal_plan (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  recipe_id  INT NOT NULL,
  plan_date  DATE NOT NULL,
  meal_type  VARCHAR(50) NOT NULL COMMENT 'desayuno | almuerzo | cena | snack',
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_meal_plan_date ON meal_plan(plan_date);

-- -----------------------------------------------------------
-- Favoritos
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  recipe_id  INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_favorites (user_id, recipe_id),
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Colecciones
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS collections (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name    VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Recetas dentro de cada colección (join table)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS collection_recipes (
  collection_id INT NOT NULL,
  recipe_id     INT NOT NULL,
  PRIMARY KEY (collection_id, recipe_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id)     REFERENCES recipes(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Estadísticas de uso
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS usage_stats (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT DEFAULT NULL,
  action_type VARCHAR(100) NOT NULL,
  recipe_id   INT DEFAULT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE SET NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_stats_action ON usage_stats(action_type);
CREATE INDEX idx_stats_date   ON usage_stats(created_at);
