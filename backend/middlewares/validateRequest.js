function validateFields(requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter(f => req.body[f] === undefined || req.body[f] === '');
    if (missing.length) {
      return res.status(400).json({
        error: `Campos requeridos: ${missing.join(', ')}`,
      });
    }
    next();
  };
}

module.exports = { validateFields };
