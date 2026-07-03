const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/stats.controller');

const router = Router();

router.use(authenticate);

router.get('/summary', ctrl.getSummary);
router.get('/actions', ctrl.getActions);
router.get('/ranking', ctrl.getRanking);
router.get('/daily', ctrl.getDaily);
router.post('/log', ctrl.log);

module.exports = router;
