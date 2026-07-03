const { pool } = require('../config/db');

const Ingredient = {
  async findAll({ category, search } = {}) {
    let sql = 'SELECT * FROM ingredients WHERE 1=1';
    const params = [];
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY category, name';
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM ingredients WHERE id = ?', [id]);
    return rows[0];
  },

  async findByName(name) {
    const [rows] = await pool.query('SELECT * FROM ingredients WHERE name = ?', [name]);
    return rows[0];
  },

  async create({ name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g }) {
    const [result] = await pool.query(
      `INSERT INTO ingredients (name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, category, calories_per_100g || null, protein_per_100g || null, carbs_per_100g || null, fat_per_100g || null]
    );
    return result.insertId;
  },

  async update(id, fields) {
    const allowed = ['name', 'category', 'calories_per_100g', 'protein_per_100g', 'carbs_per_100g', 'fat_per_100g'];
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
    await pool.query(`UPDATE ingredients SET ${set.join(', ')} WHERE id = ?`, params);
  },

  async remove(id) {
    await pool.query('DELETE FROM ingredients WHERE id = ?', [id]);
  },
};

module.exports = Ingredient;
