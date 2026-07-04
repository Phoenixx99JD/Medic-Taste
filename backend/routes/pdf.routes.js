const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/pdf.controller');

const router = Router();

router.use(authenticate);

router.get('/weekly-menu', ctrl.getWeeklyMenu);

module.exports = router;
