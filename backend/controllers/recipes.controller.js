const Recipe = require('../models/Recipe');
const UsageStats = require('../models/UsageStats');

exports.getAll = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll(req.query);
    res.json(recipes);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const recipe = await Recipe.getFullRecipe(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' });
    await UsageStats.log('recipe_viewed', recipe.id, req.user?.id);
    res.json(recipe);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const id = await Recipe.create(req.body);
    res.status(201).json({ id, message: 'Receta creada' });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await Recipe.update(req.params.id, req.body);
    res.json({ message: 'Receta actualizada' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Recipe.remove(req.params.id);
    res.json({ message: 'Receta eliminada' });
  } catch (err) { next(err); }
};

exports.getIngredients = async (req, res, next) => {
  try {
    const ingredients = await Recipe.getIngredients(req.params.id);
    res.json(ingredients);
  } catch (err) { next(err); }
};

exports.addIngredient = async (req, res, next) => {
  try {
    const { ingredient_id, amount, unit } = req.body;
    await Recipe.addIngredient(req.params.id, ingredient_id, amount, unit);
    res.status(201).json({ message: 'Ingrediente agregado' });
  } catch (err) { next(err); }
};

exports.removeIngredient = async (req, res, next) => {
  try {
    await Recipe.removeIngredient(req.params.id, req.params.ingredientId);
    res.json({ message: 'Ingrediente eliminado' });
  } catch (err) { next(err); }
};

exports.getSteps = async (req, res, next) => {
  try {
    const steps = await Recipe.getSteps(req.params.id);
    res.json(steps);
  } catch (err) { next(err); }
};

exports.saveSteps = async (req, res, next) => {
  try {
    const { steps } = req.body;
    await Recipe.clearSteps(req.params.id);
    for (let i = 0; i < steps.length; i++) {
      await Recipe.addStep(req.params.id, i + 1, steps[i].instruction, steps[i].timer_seconds);
    }
    res.json({ message: 'Pasos guardados' });
  } catch (err) { next(err); }
};
