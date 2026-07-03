const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/planner.controller');

const router = Router();

router.use(authenticate);

router.get('/week', ctrl.getWeek);
router.get('/day/:date', ctrl.getDay);
router.post('/', ctrl.add);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/clear-week', ctrl.clearWeek);

module.exports = router;
