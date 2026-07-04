const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/authenticate');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) return cb(null, true);
    cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, gif, webp)'));
  },
});

const router = Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.me);
router.put('/onboarding', authenticate, ctrl.completeOnboarding);
router.delete('/onboarding', authenticate, ctrl.resetOnboarding);
router.put('/profile/photo', authenticate, upload.single('photo'), ctrl.uploadPhoto);

module.exports = router;
