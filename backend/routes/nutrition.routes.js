const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/nutrition.controller');

const router = Router();

router.use(authenticate);

router.get('/recipe/:id', ctrl.getByRecipe);
router.get('/day/:date', ctrl.getByDay);
router.get('/week', ctrl.getByWeek);

module.exports = router;
