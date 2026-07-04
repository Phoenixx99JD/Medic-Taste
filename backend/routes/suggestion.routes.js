const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/suggestion.controller');

const router = Router();

router.use(authenticate);

router.get('/by-ingredients', ctrl.byIngredients);
router.get('/by-diet', ctrl.byDiet);
router.get('/quick-meals', ctrl.quickMeals);

module.exports = router;
