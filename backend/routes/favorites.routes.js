const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/favorites.controller');

const router = Router();

router.get('/', authenticate, ctrl.getAll);
router.post('/', authenticate, ctrl.add);
router.delete('/:recipeId', authenticate, ctrl.remove);

module.exports = router;
