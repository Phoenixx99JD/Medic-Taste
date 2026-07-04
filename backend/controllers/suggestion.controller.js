const SuggestionService = require('../services/suggestionService');

exports.byIngredients = async (req, res, next) => {
  try {
    const { ingredients, limit } = req.query;
    if (!ingredients) return res.status(400).json({ error: 'ingredients es requerido (separado por comas)' });
    const list = ingredients.split(',').map(s => s.trim()).filter(Boolean);
    const suggestions = await SuggestionService.suggestByIngredients(list, Number(limit) || 5);
    res.json(suggestions);
  } catch (err) { next(err); }
};

exports.byDiet = async (req, res, next) => {
  try {
    const { diet, limit } = req.query;
    if (!diet) return res.status(400).json({ error: 'diet es requerido' });
    const suggestions = await SuggestionService.suggestByDiet(diet, Number(limit) || 10);
    res.json(suggestions);
  } catch (err) { next(err); }
};

exports.quickMeals = async (req, res, next) => {
  try {
    const { maxMinutes, limit } = req.query;
    const suggestions = await SuggestionService.suggestQuickMeals(Number(maxMinutes) || 20, Number(limit) || 10);
    res.json(suggestions);
  } catch (err) { next(err); }
};
