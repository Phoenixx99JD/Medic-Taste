const { pool } = require('../config/db');

const Favorite = {
  async findAll(userId) {
    const [rows] = await pool.query(
      `SELECT f.*, r.name, r.photo_url, r.description, r.diet_tags
       FROM favorites f
       JOIN recipes r ON r.id = f.recipe_id
       WHERE f.user_id = ?
       ORDER BY f.id DESC`,
      [userId]
    );
    return rows;
  },

  async findById(userId, recipeId) {
    const [rows] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? AND recipe_id = ?',
      [userId, recipeId]
    );
    return rows[0];
  },

  async add(userId, recipeId) {
    await pool.query(
      'INSERT IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)',
      [userId, recipeId]
    );
  },

  async remove(userId, recipeId) {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?',
      [userId, recipeId]
    );
  },
};

module.exports = Favorite;
