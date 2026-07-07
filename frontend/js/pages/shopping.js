import { get } from '../services/api.js';

const ESTIMATED_PRICES = {
  'Pechuga de pollo': 0.0085, 'Arroz blanco': 0.002, 'Tomate': 1.00,
  'Lechuga': 0.00015, 'Cebolla': 0.0012, 'Aceite de oliva': 0.006,
  'Sal': 0.0015, 'Pasta': 0.0018, 'Queso parmesano': 0.012,
  'Huevo': 0.35, 'Leche': 0.0012, 'Harina de trigo': 0.0015,
  'Ajo': 0.004, 'Aguacate': 1.50, 'Pan integral': 0.50,
  'Atún en lata': 0.025, 'Lentejas': 0.003, 'Zanahoria': 0.001,
  'Plátano': 0.40, 'Manzana': 0.60, 'Yogur natural': 0.01,
  'Almendras': 0.015, 'Miel': 0.008, 'Pimiento rojo': 0.80, 'Calabacín': 0.90,
};


export async function renderShopping(container) {
  container.innerHTML = `
    <div class="shopping-header">
      <h1>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.4rem;color:var(--warning)"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        Lista de Compras
      </h1>
      <p>Ingredientes necesarios para tu plan semanal</p>
    </div>
    <div class="shopping-actions">
      <button class="btn btn-outline" id="refreshShopping">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
        Actualizar
      </button>
      <button class="btn btn-outline" id="clearShopping">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        Limpiar tachados
      </button>
    </div>
    <div id="shoppingContent">
      <div class="page-loading">Generando lista de compras...</div>
    </div>
  `;

  document.getElementById('refreshShopping').addEventListener('click', loadList);
  document.getElementById('clearShopping').addEventListener('click', () => {
    document.querySelectorAll('.shopping-item.checked input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.shopping-item.checked').forEach(el => el.classList.remove('checked'));
    updateTotals();
  });

  await loadList();

  async function loadList() {
    const content = document.getElementById('shoppingContent');
    content.innerHTML = '<div class="page-loading">Generando lista de compras...</div>';

    try {
      const weekPlan = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
      const recipeIds = [...new Set(
        Object.values(weekPlan).flat().map(m => m.recipe_id).filter(Boolean)
      )];

      if (!recipeIds.length) {
        content.innerHTML = `
          <div class="favorites-empty">
            <div class="icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
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
        content.innerHTML = `
          <div class="favorites-empty">
            <div class="icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
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
          const pricePer = ESTIMATED_PRICES[ing.name] || 0.01;
          grouped[cat].push({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            pricePer,
            priceTotal: (parseFloat(ing.amount) * pricePer),
          });
        }
      });

      const totalItems = allIngredients.length;
      const totalCategories = Object.keys(grouped).length;

      content.innerHTML = `
        <div class="shopping-summary">
          <div>
            <strong>${totalItems}</strong> ingredientes · <strong>${totalCategories}</strong> categorías
            <span class="shopping-summary-checked" id="checkedCount">0 marcados</span>
          </div>
          <span class="shopping-summary-total">Total: <strong id="totalPrice">$0.00</strong></span>
        </div>
        <div class="shopping-categories">
          ${Object.entries(grouped).map(([cat, items]) => `
            <div class="shopping-category">
              <h3>${cat} <span class="shopping-category-count">${items.length}</span></h3>
              ${items.map(item => `
                <div class="shopping-item" data-price="${item.priceTotal.toFixed(2)}">
                  <input type="checkbox" id="shop-${cat}-${item.name.replace(/\s/g, '')}">
                  <label for="shop-${cat}-${item.name.replace(/\s/g, '')}">${item.name}</label>
                  <span class="shopping-item-amount">${item.amount} ${item.unit}</span>
                  <span class="shopping-item-price">$${item.priceTotal.toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      `;

      content.querySelectorAll('.shopping-item input').forEach(cb => {
        cb.addEventListener('change', updateTotals);
      });

      updateTotals();

    } catch {
      content.innerHTML = `
        <div class="page-error">Error al generar la lista de compras.</div>
      `;
    }
  }

  function updateTotals() {
    const totalEl = document.getElementById('totalPrice');
    const checkedEl = document.getElementById('checkedCount');
    if (!totalEl || !checkedEl) return;
    const items = document.querySelectorAll('.shopping-item');
    const total = items.length;
    let checked = 0;
    let checkedPrice = 0;
    let totalPrice = 0;
    items.forEach(el => {
      const cb = el.querySelector('input');
      const price = parseFloat(el.dataset.price) || 0;
      totalPrice += price;
      if (cb.checked) {
        checked++;
        checkedPrice += price;
        el.classList.add('checked');
      } else {
        el.classList.remove('checked');
      }
    });
    checkedEl.textContent = `${checked}/${total} marcados · $${checkedPrice.toFixed(2)}`;
    totalEl.textContent = `$${totalPrice.toFixed(2)}`;
  }
}