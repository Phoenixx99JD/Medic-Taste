const { pool } = require('../config/db');

const ShoppingListService = {
  async generateFromWeek(userId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT i.id AS ingredient_id, i.category, i.name, i.price_per_unit,
              SUM(ri.amount) AS total_amount, ri.unit
       FROM meal_plan mp
       JOIN recipe_ingredients ri ON ri.recipe_id = mp.recipe_id
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE mp.user_id = ? AND mp.plan_date BETWEEN ? AND ?
       GROUP BY i.id, i.category, i.name, i.price_per_unit, ri.unit
       ORDER BY i.category, i.name`,
      [userId, startDate, endDate]
    );

    const ingredientIds = [...new Set(rows.map(r => r.ingredient_id))];
    let storePricesMap = {};

    if (ingredientIds.length) {
      const placeholders = ingredientIds.map(() => '?').join(',');
      const [storeRows] = await pool.query(
        `SELECT isp.ingredient_id, isp.store, isp.price, isp.product_url
         FROM ingredient_store_prices isp
         WHERE isp.ingredient_id IN (${placeholders})`,
        ingredientIds
      );
      for (const sp of storeRows) {
        if (!storePricesMap[sp.ingredient_id]) storePricesMap[sp.ingredient_id] = [];
        storePricesMap[sp.ingredient_id].push({
          store: sp.store,
          price: parseFloat(sp.price),
          product_url: sp.product_url,
        });
      }
    }

    const grouped = {};
    for (const item of rows) {
      if (!grouped[item.category]) grouped[item.category] = [];

      const stores = storePricesMap[item.ingredient_id] || [];
      let bestPrice = parseFloat(item.price_per_unit) || 0;

      if (stores.length) {
        const cheapest = stores.reduce((min, s) => (s.price < min.price ? s : min), stores[0]);
        bestPrice = cheapest.price;
      }

      grouped[item.category].push({
        ingredient_id: item.ingredient_id,
        name: item.name,
        amount: parseFloat(item.total_amount.toFixed(2)),
        unit: item.unit,
        best_price: bestPrice,
        store_prices: stores,
      });
    }
    return grouped;
  },

  async getStorePrices(ingredientId) {
    const [rows] = await pool.query(
      `SELECT isp.store, isp.price, isp.product_url,
              i.name AS ingredient_name, i.price_per_unit
       FROM ingredient_store_prices isp
       JOIN ingredients i ON i.id = isp.ingredient_id
       WHERE isp.ingredient_id = ?
       ORDER BY isp.price ASC`,
      [ingredientId]
    );
    return rows;
  },
};

module.exports = ShoppingListService;
