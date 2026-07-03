const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/collections.controller');

const router = Router();

router.use(authenticate);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.post('/:id/recipes', ctrl.addRecipe);
router.delete('/:id/recipes/:recipeId', ctrl.removeRecipe);

module.exports = router;
