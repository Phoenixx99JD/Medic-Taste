const { pool } = require('../config/db');

const UsageStats = {
  async log(actionType, recipeId = null, userId = null) {
    const [result] = await pool.query(
      'INSERT INTO usage_stats (user_id, action_type, recipe_id) VALUES (?, ?, ?)',
      [userId, actionType, recipeId]
    );
    return result.insertId;
  },

  async getStats() {
    const [rows] = await pool.query(
      `SELECT action_type, COUNT(*) AS count
       FROM usage_stats
       GROUP BY action_type
       ORDER BY count DESC`
    );
    return rows;
  },

  async getRecipeRanking(limit = 10) {
    const [rows] = await pool.query(
      `SELECT r.id, r.name, r.photo_url, COUNT(*) AS views
       FROM usage_stats us
       JOIN recipes r ON r.id = us.recipe_id
       WHERE us.action_type = 'recipe_viewed'
       GROUP BY r.id, r.name
       ORDER BY views DESC
       LIMIT ?`,
      [Number(limit)]
    );
    return rows;
  },

  async getDailyStats(days = 30) {
    const [rows] = await pool.query(
      `SELECT DATE(created_at) AS date, action_type, COUNT(*) AS count
       FROM usage_stats
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(created_at), action_type
       ORDER BY date DESC`,
      [String(days)]
    );
    return rows;
  },

  async getTotalCounts() {
    const [recipes] = await pool.query('SELECT COUNT(*) AS total FROM recipes');
    const [favorites] = await pool.query('SELECT COUNT(*) AS total FROM favorites');
    const [planned] = await pool.query('SELECT COUNT(*) AS total FROM meal_plan');
    const [ingredients] = await pool.query('SELECT COUNT(*) AS total FROM ingredients');
    return {
      recipes: recipes[0].total,
      favorites: favorites[0].total,
      plannedMeals: planned[0].total,
      ingredients: ingredients[0].total,
    };
  },
};

module.exports = UsageStats;
