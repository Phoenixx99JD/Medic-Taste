const { pool } = require('../config/db');

const Recipe = {
  async findAll({ search, diet, page = 1, limit = 20 } = {}) {
    let sql = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];
    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    if (diet) {
      const diets = diet.split(',');
      const conditions = diets.map(() => 'FIND_IN_SET(?, diet_tags)');
      sql += ` AND (${conditions.join(' OR ')})`;
      params.push(...diets);
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ name, photo_url, description, servings, prep_time_minutes, diet_tags }) {
    const [result] = await pool.query(
      `INSERT INTO recipes (name, photo_url, description, servings, prep_time_minutes, diet_tags)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, photo_url || null, description || null, servings || 4, prep_time_minutes || null, diet_tags || null]
    );
    return result.insertId;
  },

  async update(id, fields) {
    const allowed = ['name', 'photo_url', 'description', 'servings', 'prep_time_minutes', 'diet_tags'];
    const set = [];
    const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        set.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }
    if (!set.length) return;
    params.push(id);
    await pool.query(`UPDATE recipes SET ${set.join(', ')} WHERE id = ?`, params);
  },

  async remove(id) {
    await pool.query('DELETE FROM recipes WHERE id = ?', [id]);
  },

  async getIngredients(recipeId) {
    const [rows] = await pool.query(
      `SELECT i.*, ri.amount, ri.unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE ri.recipe_id = ?
       ORDER BY i.category, i.name`,
      [recipeId]
    );
    return rows;
  },

  async getSteps(recipeId) {
    const [rows] = await pool.query(
      'SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number',
      [recipeId]
    );
    return rows;
  },

  async addIngredient(recipeId, ingredientId, amount, unit) {
    await pool.query(
      'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES (?, ?, ?, ?)',
      [recipeId, ingredientId, amount, unit]
    );
  },

  async removeIngredient(recipeId, ingredientId) {
    await pool.query(
      'DELETE FROM recipe_ingredients WHERE recipe_id = ? AND ingredient_id = ?',
      [recipeId, ingredientId]
    );
  },

  async addStep(recipeId, stepNumber, instruction, timerSeconds) {
    await pool.query(
      'INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES (?, ?, ?, ?)',
      [recipeId, stepNumber, instruction, timerSeconds || null]
    );
  },

  async clearSteps(recipeId) {
    await pool.query('DELETE FROM recipe_steps WHERE recipe_id = ?', [recipeId]);
  },

  async getFullRecipe(id) {
    const recipe = await this.findById(id);
    if (!recipe) return null;
    const [ingredients] = await pool.query(
      `SELECT i.*, ri.amount, ri.unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE ri.recipe_id = ?`,
      [id]
    );
    const [steps] = await pool.query(
      'SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number',
      [id]
    );
    return { ...recipe, ingredients, steps };
  },
};

module.exports = Recipe;
