const pool = require('../config/db');

const ShoppingListService = {
  async generateFromWeek(userId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT i.category, i.name, SUM(ri.amount) AS total_amount, ri.unit
       FROM meal_plan mp
       JOIN recipe_ingredients ri ON ri.recipe_id = mp.recipe_id
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE mp.user_id = ? AND mp.plan_date BETWEEN ? AND ?
       GROUP BY i.category, i.name, ri.unit
       ORDER BY i.category, i.name`,
      [userId, startDate, endDate]
    );
    const grouped = {};
    for (const item of rows) {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push({
        name: item.name,
        amount: parseFloat(item.total_amount.toFixed(2)),
        unit: item.unit,
      });
    }
    return grouped;
  },
};

module.exports = ShoppingListService;
