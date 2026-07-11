const ShoppingListService = require('../services/shoppingListService');

exports.getByWeek = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: 'start y end son requeridos' });
    const list = await ShoppingListService.generateFromWeek(req.user.id, start, end);
    res.json(list);
  } catch (err) { next(err); }
};

exports.getStorePrices = async (req, res, next) => {
  try {
    const { ingredientId } = req.params;
    const prices = await ShoppingListService.getStorePrices(ingredientId);
    if (!prices.length) return res.status(404).json({ error: 'No hay precios registrados para este ingrediente' });
    res.json(prices);
  } catch (err) { next(err); }
};
