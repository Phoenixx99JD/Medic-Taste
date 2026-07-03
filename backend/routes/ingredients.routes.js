const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/ingredients.controller');

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', authenticate, ctrl.create);
router.put('/:id', authenticate, ctrl.update);
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;
