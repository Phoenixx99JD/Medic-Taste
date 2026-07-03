const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.me);

module.exports = router;
