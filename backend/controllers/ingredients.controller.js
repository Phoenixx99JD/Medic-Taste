const Ingredient = require('../models/Ingredient');

exports.getAll = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.findAll(req.query);
    res.json(ingredients);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ error: 'Ingrediente no encontrado' });
    res.json(ingredient);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const existing = await Ingredient.findByName(req.body.name);
    if (existing) return res.status(409).json({ error: 'El ingrediente ya existe' });
    const id = await Ingredient.create(req.body);
    res.status(201).json({ id, message: 'Ingrediente creado' });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await Ingredient.update(req.params.id, req.body);
    res.json({ message: 'Ingrediente actualizado' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Ingredient.remove(req.params.id);
    res.json({ message: 'Ingrediente eliminado' });
  } catch (err) { next(err); }
};
