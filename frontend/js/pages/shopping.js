import { get } from '../services/api.js';

const STORE_LABELS = {
  exito: 'Éxito',
  olimpica: 'Olímpica',
  d1: 'D1',
  ara: 'Ara',
};

const STORE_COLORS = {
  exito: '#FF6B00',
  olimpica: '#E31837',
  d1: '#FFD700',
  ara: '#00A651',
};

function formatCOP(value) {
  return '$ ' + Math.round(value).toLocaleString('es-CO');
}

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

      let grouped = {};
      allIngredients.forEach(ing => {
        const cat = ing.category || 'Otros';
        if (!grouped[cat]) grouped[cat] = [];
        const existing = grouped[cat].find(g => g.name === ing.name);
        if (existing) {
          existing.amount = (parseFloat(existing.amount) + parseFloat(ing.amount)).toFixed(1);
          existing.pricePer = parseFloat(ing.price_per_unit) || 0;
        } else {
          grouped[cat].push({
            ingredient_id: ing.id,
            name: ing.name,
            amount: parseFloat(ing.amount),
            unit: ing.unit,
            pricePer: parseFloat(ing.price_per_unit) || 0,
            store_prices: ing.store_prices || null,
          });
        }
      });

      for (const cat of Object.keys(grouped)) {
        for (const item of grouped[cat]) {
          if (!item.store_prices) {
            try {
              const stores = await get(`/shopping-list/stores/${item.ingredient_id}`);
              item.store_prices = stores;
            } catch {
              item.store_prices = [];
            }
          }
          if (item.store_prices.length) {
            const cheapest = item.store_prices.reduce((min, s) => (s.price < min.price ? s : min), item.store_prices[0]);
            item.best_price = cheapest.price;
          } else {
            item.best_price = item.pricePer;
          }
        }
      }

      const totalItems = allIngredients.length;
      const totalCategories = Object.keys(grouped).length;

      content.innerHTML = `
        <div class="shopping-summary">
          <div>
            <strong>${totalItems}</strong> ingredientes · <strong>${totalCategories}</strong> categorías
            <span class="shopping-summary-checked" id="checkedCount">0 marcados</span>
          </div>
          <span class="shopping-summary-total">Total: <strong id="totalPrice">$0</strong></span>
        </div>
        <div class="shopping-categories">
          ${Object.entries(grouped).map(([cat, items]) => `
            <div class="shopping-category">
              <h3>${cat} <span class="shopping-category-count">${items.length}</span></h3>
              ${items.map(item => `
                <div class="shopping-item" data-price="${item.best_price * item.amount}" data-id="${item.ingredient_id}">
                  <input type="checkbox" id="shop-${item.ingredient_id}">
                  <label for="shop-${item.ingredient_id}">${item.name}</label>
                  <span class="shopping-item-amount">${item.amount} ${item.unit}</span>
                  <span class="shopping-item-price">${formatCOP(item.best_price * item.amount)}</span>
                  <button class="shopping-store-btn" data-id="${item.ingredient_id}" title="Ver dónde comprar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </button>
                </div>
                <div class="shopping-store-panel" id="store-panel-${item.ingredient_id}">
                  ${item.store_prices.length ? item.store_prices.map(sp => `
                    <div class="shopping-store-row">
                      <span class="shopping-store-dot" style="background:${STORE_COLORS[sp.store] || '#888'}"></span>
                      <span class="shopping-store-name">${STORE_LABELS[sp.store] || sp.store}</span>
                      <span class="shopping-store-price">${formatCOP(sp.price)}</span>
                      <span class="shopping-store-link">
                        ${sp.product_url
                          ? `<a href="${sp.product_url}" target="_blank" rel="noopener">Ver producto</a>`
                          : '<span class="shopping-store-physical">Disponible en tienda física</span>'}
                      </span>
                    </div>
                  `).join('') : '<div class="shopping-store-empty">Sin precios registrados en tiendas</div>'}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      `;

      content.querySelectorAll('.shopping-item input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', updateTotals);
      });

      content.querySelectorAll('.shopping-store-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const panel = document.getElementById(`store-panel-${id}`);
          if (!panel) return;
          const wasOpen = panel.classList.contains('open');
          document.querySelectorAll('.shopping-store-panel.open').forEach(p => p.classList.remove('open'));
          if (!wasOpen) panel.classList.add('open');
        });
      });

      updateTotals();

    } catch (err) {
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
    checkedEl.textContent = `${checked}/${total} marcados · ${formatCOP(checkedPrice)}`;
    totalEl.textContent = formatCOP(totalPrice);
  }
}
