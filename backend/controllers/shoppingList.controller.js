const ShoppingListService = require('../services/shoppingListService');

exports.getByWeek = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: 'start y end son requeridos' });
    const list = await ShoppingListService.generateFromWeek(req.user.id, start, end);
    res.json(list);
  } catch (err) { next(err); }
};
