import { get } from '../services/api.js';

export async function renderShopping(container) {
  container.innerHTML = `
    <div class="shopping-header">
      <h1>🛒 Lista de Compras</h1>
      <p>Ingredientes necesarios para tu plan semanal.</p>
    </div>
    <div id="shoppingContent">
      <div class="page-loading">Generando lista de compras...</div>
    </div>
  `;

  try {
    const weekPlan = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
    const recipeIds = [...new Set(
      Object.values(weekPlan).flat().map(m => m.recipe_id).filter(Boolean)
    )];

    if (!recipeIds.length) {
      document.getElementById('shoppingContent').innerHTML = `
        <div class="favorites-empty">
          <div class="icon">🛒</div>
          <h3>No hay comidas planificadas</h3>
          <p>Primero crea un plan semanal para ver tu lista de compras.</p>
        </div>
      `;
      return;
    }

    const allIngredients = [];
    for (const id of recipeIds) {
      try {
        const recipe = await get(`/recipes/${id}`);
        if (recipe.ingredients) allIngredients.push(...recipe.ingredients);
      } catch {}
    }

    if (!allIngredients.length) {
      document.getElementById('shoppingContent').innerHTML = `
        <div class="favorites-empty">
          <div class="icon">🛒</div>
          <h3>Sin ingredientes</h3>
          <p>Las recetas de tu plan no tienen ingredientes registrados.</p>
        </div>
      `;
      return;
    }

    const grouped = {};
    allIngredients.forEach(ing => {
      const cat = ing.category || 'Otros';
      if (!grouped[cat]) grouped[cat] = [];
      const existing = grouped[cat].find(g => g.name === ing.name);
      if (existing) {
        existing.amount = (parseFloat(existing.amount) + parseFloat(ing.amount)).toFixed(1);
      } else {
        grouped[cat].push({ name: ing.name, amount: ing.amount, unit: ing.unit });
      }
    });

    const catIcons = {
      'Verduras': '🥦', 'Frutas': '🍎', 'Carnes': '🥩', 'Pescados': '🐟',
      'Lácteos': '🥛', 'Cereales': '🌾', 'Legumbres': '🫘', 'Especias': '🌿',
      'Aceites': '🫒', 'Bebidas': '🥤', 'Otros': '📦',
    };

    const content = document.getElementById('shoppingContent');
    content.innerHTML = `
      <div class="shopping-categories">
        ${Object.entries(grouped).map(([cat, items]) => `
          <div class="shopping-category">
            <h3>${catIcons[cat] || '📦'} ${cat}</h3>
            ${items.map(item => `
              <div class="shopping-item">
                <input type="checkbox" id="shop-${cat}-${item.name.replace(/\s/g, '')}">
                <label for="shop-${cat}-${item.name.replace(/\s/g, '')}">${item.name}</label>
                <span class="shopping-item-amount">${item.amount} ${item.unit}</span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;

    content.querySelectorAll('.shopping-item input').forEach(cb => {
      cb.addEventListener('change', () => {
        cb.closest('.shopping-item').classList.toggle('checked', cb.checked);
      });
    });

  } catch {
    document.getElementById('shoppingContent').innerHTML = `
      <div class="page-error">Error al generar la lista de compras.</div>
    `;
  }
}