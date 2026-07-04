const MealPlan = require('../models/MealPlan');
const PdfService = require('../services/pdfService');

exports.getWeeklyMenu = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: 'start y end son requeridos' });
    const meals = await MealPlan.getWeeklySummary(req.user.id, start, end);
    if (!meals.length) return res.status(404).json({ error: 'No hay comidas planificadas en esa semana' });
    const pdf = await PdfService.generateWeeklyMenu(meals);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="menu-semanal-${start}-${end}.pdf"`);
    res.send(pdf);
  } catch (err) { next(err); }
};
