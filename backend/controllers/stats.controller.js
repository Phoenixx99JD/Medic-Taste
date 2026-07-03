const UsageStats = require('../models/UsageStats');

exports.getSummary = async (req, res, next) => {
  try {
    const totals = await UsageStats.getTotalCounts();
    res.json(totals);
  } catch (err) { next(err); }
};

exports.getActions = async (req, res, next) => {
  try {
    const stats = await UsageStats.getStats();
    res.json(stats);
  } catch (err) { next(err); }
};

exports.getRanking = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const ranking = await UsageStats.getRecipeRanking(limit);
    res.json(ranking);
  } catch (err) { next(err); }
};

exports.getDaily = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await UsageStats.getDailyStats(days);
    res.json(data);
  } catch (err) { next(err); }
};

exports.log = async (req, res, next) => {
  try {
    const { action_type, recipe_id } = req.body;
    await UsageStats.log(action_type, recipe_id || null, req.user.id);
    res.status(201).json({ message: 'Acción registrada' });
  } catch (err) { next(err); }
};
