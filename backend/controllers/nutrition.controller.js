const NutritionService = require('../services/nutritionService');

exports.getByRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nutrition = await NutritionService.getRecipeNutrition(id);
    res.json(nutrition);
  } catch (err) { next(err); }
};

exports.getByDay = async (req, res, next) => {
  try {
    const { date } = req.params;
    const nutrition = await NutritionService.getDayNutrition(req.user.id, date);
    res.json(nutrition);
  } catch (err) { next(err); }
};

exports.getByWeek = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: 'start y end son requeridos' });
    const nutrition = await NutritionService.getWeekNutrition(req.user.id, start, end);
    res.json(nutrition);
  } catch (err) { next(err); }
};
