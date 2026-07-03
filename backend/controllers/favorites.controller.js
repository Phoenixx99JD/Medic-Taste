const Favorite = require('../models/Favorite');

exports.getAll = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll(req.user.id);
    res.json(favorites);
  } catch (err) { next(err); }
};

exports.add = async (req, res, next) => {
  try {
    const { recipe_id } = req.body;
    const existing = await Favorite.findById(req.user.id, recipe_id);
    if (existing) return res.status(409).json({ error: 'Ya está en favoritos' });
    await Favorite.add(req.user.id, recipe_id);
    res.status(201).json({ message: 'Agregado a favoritos' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Favorite.remove(req.user.id, req.params.recipeId);
    res.json({ message: 'Eliminado de favoritos' });
  } catch (err) { next(err); }
};
