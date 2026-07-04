const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { SECRET } = require('../middlewares/authenticate');

const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET, { expiresIn: '7d' });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email y password son requeridos' });
    }
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const id = await User.create({ name, email, password: hashed });
    const token = generateToken({ id, name, email });

    res.status(201).json({ token, user: { id, name, email, onboarding_completed: 0, photo_url: null } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son requeridos' });
    }
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, onboarding_completed: user.onboarding_completed, photo_url: user.photo_url || null } });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.completeOnboarding = async (req, res, next) => {
  try {
    await User.update(req.user.id, { onboarding_completed: 1 });
    res.json({ message: 'Onboarding completado' });
  } catch (err) { next(err); }
};

exports.resetOnboarding = async (req, res, next) => {
  try {
    await User.update(req.user.id, { onboarding_completed: 0 });
    res.json({ message: 'Onboarding reiniciado' });
  } catch (err) { next(err); }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ninguna imagen' });
    const photoUrl = `/uploads/${req.file.filename}`;
    await User.update(req.user.id, { photo_url: photoUrl });
    const user = await User.findById(req.user.id);
    res.json({ photo_url: photoUrl, user });
  } catch (err) { next(err); }
};
