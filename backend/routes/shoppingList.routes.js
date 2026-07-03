const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const ctrl = require('../controllers/shoppingList.controller');

const router = Router();

router.use(authenticate);

module.exports = router;
