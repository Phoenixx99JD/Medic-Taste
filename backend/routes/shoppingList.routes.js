const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/shoppingList.controller');

const router = Router();

router.use(authenticate);

router.get('/week', ctrl.getByWeek);
router.get('/stores/:ingredientId', ctrl.getStorePrices);

module.exports = router;
