const { pool } = require('../config/db');

const MealPlan = {
  async findByDateRange(userId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT mp.*, r.name AS recipe_name, r.photo_url, r.diet_tags
       FROM meal_plan mp
       JOIN recipes r ON r.id = mp.recipe_id
       WHERE mp.user_id = ? AND mp.plan_date BETWEEN ? AND ?
       ORDER BY mp.plan_date, FIELD(mp.meal_type, 'desayuno', 'almuerzo', 'cena', 'snack')`,
      [userId, startDate, endDate]
    );
    return rows;
  },

  async findByDate(userId, date) {
    const [rows] = await pool.query(
      `SELECT mp.*, r.name AS recipe_name, r.photo_url
       FROM meal_plan mp
       JOIN recipes r ON r.id = mp.recipe_id
       WHERE mp.user_id = ? AND mp.plan_date = ?
       ORDER BY FIELD(mp.meal_type, 'desayuno', 'almuerzo', 'cena', 'snack')`,
      [userId, date]
    );
    return rows;
  },

  async add(userId, recipeId, planDate, mealType) {
    const [result] = await pool.query(
      'INSERT INTO meal_plan (user_id, recipe_id, plan_date, meal_type) VALUES (?, ?, ?, ?)',
      [userId, recipeId, planDate, mealType]
    );
    return result.insertId;
  },

  async remove(id) {
    await pool.query('DELETE FROM meal_plan WHERE id = ?', [id]);
  },

  async update(id, { plan_date, meal_type }) {
    const set = [];
    const params = [];
    if (plan_date) { set.push('plan_date = ?'); params.push(plan_date); }
    if (meal_type) { set.push('meal_type = ?'); params.push(meal_type); }
    if (!set.length) return;
    params.push(id);
    await pool.query(`UPDATE meal_plan SET ${set.join(', ')} WHERE id = ?`, params);
  },

  async getWeeklySummary(userId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT mp.plan_date, mp.meal_type, r.id AS recipe_id, r.name AS recipe_name,
              r.servings, r.prep_time_minutes, r.diet_tags
       FROM meal_plan mp
       JOIN recipes r ON r.id = mp.recipe_id
       WHERE mp.user_id = ? AND mp.plan_date BETWEEN ? AND ?
       ORDER BY mp.plan_date, FIELD(mp.meal_type, 'desayuno', 'almuerzo', 'cena', 'snack')`,
      [userId, startDate, endDate]
    );
    return rows;
  },

  async clearWeek(userId, startDate, endDate) {
    await pool.query(
      'DELETE FROM meal_plan WHERE user_id = ? AND plan_date BETWEEN ? AND ?',
      [userId, startDate, endDate]
    );
  },
};

module.exports = MealPlan;
