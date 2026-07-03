const pool = require('../config/db');

const NutritionService = {
  async getRecipeNutrition(recipeId) {
    const [rows] = await pool.query(
      `SELECT SUM(i.calories_per_100g * ri.amount / 100) AS total_calories,
              SUM(i.protein_per_100g * ri.amount / 100) AS total_protein,
              SUM(i.carbs_per_100g * ri.amount / 100) AS total_carbs,
              SUM(i.fat_per_100g * ri.amount / 100) AS total_fat
       FROM recipe_ingredients ri
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE ri.recipe_id = ? AND ri.unit = 'g'`,
      [recipeId]
    );
    return rows[0];
  },

  async getDayNutrition(date) {
    const [rows] = await pool.query(
      `SELECT SUM(i.calories_per_100g * ri.amount / 100) AS total_calories,
              SUM(i.protein_per_100g * ri.amount / 100) AS total_protein,
              SUM(i.carbs_per_100g * ri.amount / 100) AS total_carbs,
              SUM(i.fat_per_100g * ri.amount / 100) AS total_fat
       FROM meal_plan mp
       JOIN recipe_ingredients ri ON ri.recipe_id = mp.recipe_id
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE mp.plan_date = ? AND ri.unit = 'g'`,
      [date]
    );
    return rows[0];
  },

  async getWeekNutrition(startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT mp.plan_date,
              SUM(i.calories_per_100g * ri.amount / 100) AS total_calories,
              SUM(i.protein_per_100g * ri.amount / 100) AS total_protein,
              SUM(i.carbs_per_100g * ri.amount / 100) AS total_carbs,
              SUM(i.fat_per_100g * ri.amount / 100) AS total_fat
       FROM meal_plan mp
       JOIN recipe_ingredients ri ON ri.recipe_id = mp.recipe_id
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE mp.plan_date BETWEEN ? AND ? AND ri.unit = 'g'
       GROUP BY mp.plan_date
       ORDER BY mp.plan_date`,
      [startDate, endDate]
    );
    return rows;
  },
};

module.exports = NutritionService;
