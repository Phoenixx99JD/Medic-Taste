const MealPlan = require('../models/MealPlan');
const UsageStats = require('../models/UsageStats');

exports.getWeek = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: 'start y end son requeridos (YYYY-MM-DD)' });
    const meals = await MealPlan.findByDateRange(req.user.id, start, end);
    res.json(meals);
  } catch (err) { next(err); }
};

exports.getDay = async (req, res, next) => {
  try {
    const meals = await MealPlan.findByDate(req.user.id, req.params.date);
    res.json(meals);
  } catch (err) { next(err); }
};

exports.add = async (req, res, next) => {
  try {
    const { recipe_id, plan_date, meal_type } = req.body;
    const id = await MealPlan.add(req.user.id, recipe_id, plan_date, meal_type);
    await UsageStats.log('plan_created', recipe_id, req.user.id);
    res.status(201).json({ id, message: 'Comida planificada' });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await MealPlan.update(req.params.id, req.user.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Plan no encontrado' });
    res.json({ message: 'Plan actualizado' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await MealPlan.remove(req.params.id, req.user.id);
    if (!removed) return res.status(404).json({ error: 'Comida no encontrada en el plan' });
    res.json({ message: 'Comida eliminada del plan' });
  } catch (err) { next(err); }
};

exports.clearWeek = async (req, res, next) => {
  try {
    const { start, end } = req.body;
    await MealPlan.clearWeek(req.user.id, start, end);
    res.json({ message: 'Semana limpiada' });
  } catch (err) { next(err); }
};