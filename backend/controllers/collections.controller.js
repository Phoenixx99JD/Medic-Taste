const Collection = require('../models/Collection');

exports.getAll = async (req, res, next) => {
  try {
    const collections = await Collection.findAll(req.user.id);
    res.json(collections);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection || collection.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Colección no encontrada' });
    }
    const recipes = await Collection.getRecipes(req.params.id);
    res.json({ ...collection, recipes });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });
    const id = await Collection.create(req.user.id, name);
    res.status(201).json({ id, message: 'Colección creada' });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { name } = req.body;
    const updated = await Collection.update(req.params.id, req.user.id, name);
    if (!updated) return res.status(404).json({ error: 'Colección no encontrada' });
    res.json({ message: 'Colección actualizada' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await Collection.remove(req.params.id, req.user.id);
    if (!removed) return res.status(404).json({ error: 'Colección no encontrada' });
    res.json({ message: 'Colección eliminada' });
  } catch (err) { next(err); }
};

exports.addRecipe = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection || collection.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Colección no encontrada' });
    }
    const { recipe_id } = req.body;
    await Collection.addRecipe(req.params.id, recipe_id);
    res.status(201).json({ message: 'Receta agregada a la colección' });
  } catch (err) { next(err); }
};

exports.removeRecipe = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection || collection.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Colección no encontrada' });
    }
    await Collection.removeRecipe(req.params.id, req.params.recipeId);
    res.json({ message: 'Receta eliminada de la colección' });
  } catch (err) { next(err); }
};