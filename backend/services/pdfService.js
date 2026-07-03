const PDFDocument = require('pdfkit');

const PdfService = {
  generateWeeklyMenu(meals) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers = [];

      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      doc.fontSize(22).text('TasteFlow - Menú Semanal', { align: 'center' });
      doc.moveDown();

      const groupedByDay = {};
      for (const meal of meals) {
        const day = meal.plan_date;
        if (!groupedByDay[day]) groupedByDay[day] = [];
        groupedByDay[day].push(meal);
      }

      for (const [date, dayMeals] of Object.entries(groupedByDay)) {
        doc.fontSize(14).fillColor('#333').text(new Date(date).toLocaleDateString('es-ES', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        }));
        doc.moveDown(0.5);

        for (const meal of dayMeals) {
          doc.fontSize(12).fillColor('#555');
          const typeLabel = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', snack: 'Snack' };
          doc.text(`${typeLabel[meal.meal_type] || meal.meal_type}: ${meal.recipe_name}`);
        }
        doc.moveDown();
      }

      doc.end();
    });
  },
};

module.exports = PdfService;
