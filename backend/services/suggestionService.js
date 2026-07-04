const { pool } = require('../config/db');

const SuggestionService = {
  async suggestByIngredients(ingredientNames, limit = 5) {
    if (!ingredientNames.length) return [];
    const placeholders = ingredientNames.map(() => '?');
    const [rows] = await pool.query(
      `SELECT r.id, r.name, r.photo_url, r.description, r.prep_time_minutes, r.diet_tags,
              COUNT(DISTINCT ri.ingredient_id) AS matching_ingredients,
              (SELECT COUNT(*) FROM recipe_ingredients WHERE recipe_id = r.id) AS total_ingredients
       FROM recipes r
       JOIN recipe_ingredients ri ON ri.recipe_id = r.id
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE i.name IN (${placeholders.join(',')})
       GROUP BY r.id
       ORDER BY matching_ingredients DESC, total_ingredients ASC
       LIMIT ?`,
      [...ingredientNames, String(limit)]
    );
    return rows;
  },

  async suggestByDiet(diet, limit = 10) {
    const [rows] = await pool.query(
      "SELECT * FROM recipes WHERE FIND_IN_SET(?, diet_tags) ORDER BY created_at DESC LIMIT ?",
      [diet, String(limit)]
    );
    return rows;
  },

  async suggestQuickMeals(maxMinutes = 20, limit = 10) {
    const [rows] = await pool.query(
      'SELECT * FROM recipes WHERE prep_time_minutes <= ? ORDER BY prep_time_minutes ASC LIMIT ?',
      [maxMinutes, String(limit)]
    );
    return rows;
  },
};

module.exports = SuggestionService;
