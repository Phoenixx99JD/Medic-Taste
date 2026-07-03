const { pool } = require('../config/db');

const Collection = {
  async findAll(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM collections WHERE user_id = ? ORDER BY name',
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM collections WHERE id = ?', [id]);
    return rows[0];
  },

  async create(userId, name) {
    const [result] = await pool.query(
      'INSERT INTO collections (user_id, name) VALUES (?, ?)',
      [userId, name]
    );
    return result.insertId;
  },

  async update(id, name) {
    await pool.query('UPDATE collections SET name = ? WHERE id = ?', [name, id]);
  },

  async remove(id) {
    await pool.query('DELETE FROM collections WHERE id = ?', [id]);
  },

  async getRecipes(collectionId) {
    const [rows] = await pool.query(
      `SELECT r.* FROM recipes r
       JOIN collection_recipes cr ON cr.recipe_id = r.id
       WHERE cr.collection_id = ?
       ORDER BY r.name`,
      [collectionId]
    );
    return rows;
  },

  async addRecipe(collectionId, recipeId) {
    await pool.query(
      'INSERT IGNORE INTO collection_recipes (collection_id, recipe_id) VALUES (?, ?)',
      [collectionId, recipeId]
    );
  },

  async removeRecipe(collectionId, recipeId) {
    await pool.query(
      'DELETE FROM collection_recipes WHERE collection_id = ? AND recipe_id = ?',
      [collectionId, recipeId]
    );
  },
};

module.exports = Collection;
