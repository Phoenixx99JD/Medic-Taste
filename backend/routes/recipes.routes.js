const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/recipes.controller');

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', authenticate, ctrl.create);
router.put('/:id', authenticate, ctrl.update);
router.delete('/:id', authenticate, ctrl.remove);

router.get('/:id/ingredients', ctrl.getIngredients);
router.post('/:id/ingredients', authenticate, ctrl.addIngredient);
router.delete('/:id/ingredients/:ingredientId', authenticate, ctrl.removeIngredient);

router.get('/:id/steps', ctrl.getSteps);
router.put('/:id/steps', authenticate, ctrl.saveSteps);

module.exports = router;
