const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.me);
router.put('/onboarding', authenticate, ctrl.completeOnboarding);
router.delete('/onboarding', authenticate, ctrl.resetOnboarding);

module.exports = router;
