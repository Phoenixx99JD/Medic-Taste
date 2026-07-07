import { get } from '../services/api.js';
import { logUsage } from '../services/usage.js';

const MEAL_ICONS = {
  desayuno: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
  almuerzo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M2 12h20"></path><path d="M2 18h20"></path><path d="M2 6h20"></path></svg>',
  cena: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M3 3l18 18"></path><path d="M21 3l-18 18"></path></svg>',
  snack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>',
};
const MEAL_LABELS = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', snack: 'Snack' };

const DAY_ART = [
  '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:80px;height:80px;opacity:0.15;position:absolute;bottom:-8px;right:-8px;color:var(--primary)"><circle cx="40" cy="40" r="30"/><path d="M25 45c0-8 6-15 15-15s15 7 15 15"/><path d="M30 50c0-6 4-10 10-10s10 4 10 10"/><circle cx="30" cy="30" r="3" fill="currentColor"/><circle cx="50" cy="30" r="3" fill="currentColor"/></svg>',
  '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:80px;height:80px;opacity:0.15;position:absolute;bottom:-8px;right:-8px;color:var(--primary)"><path d="M20 60V20l12-4v40"/><path d="M32 16l18-6v44l-18 6"/><path d="M50 10l12 4v44l-12-4"/><path d="M32 30l18-6"/><path d="M32 40l18-6"/></svg>',
  '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:80px;height:80px;opacity:0.15;position:absolute;bottom:-8px;right:-8px;color:var(--primary)"><path d="M40 10L10 45h12v20h16V50h4v15h16V45h12L40 10z"/><circle cx="32" cy="18" r="2" fill="currentColor"/><path d="M45 8c2 0 4 2 4 5"/></svg>',
  '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:80px;height:80px;opacity:0.15;position:absolute;bottom:-8px;right:-8px;color:var(--primary)"><circle cx="40" cy="40" r="18"/><path d="M40 18V10M40 70v-8M62 40h8M10 40h8M55.6 24.4l5.6-5.6M18.8 61.2l5.6-5.6M55.6 55.6l5.6 5.6M18.8 18.8l5.6 5.6"/><circle cx="40" cy="40" r="8" fill="currentColor"/></svg>',
  '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:80px;height:80px;opacity:0.15;position:absolute;bottom:-8px;right:-8px;color:var(--primary)"><path d="M40 15c0 0-8 5-12 10s-4 10 0 15c2 2.5 4 4 6 5"/><path d="M40 15c0 0 8 5 12 10s4 10 0 15c-2 2.5-4 4-6 5"/><path d="M34 45c2 3 4 5 6 5s4-2 6-5"/><path d="M38 30l2-2 2 2-2 2z"/><path d="M40 20v8"/><path d="M25 65l5-4 5 4 5-4 5 4 5-4 5 4"/></svg>',
  '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:80px;height:80px;opacity:0.15;position:absolute;bottom:-8px;right:-8px;color:var(--primary)"><path d="M20 55c0-8 4-15 10-15s10 7 10 15"/><path d="M40 40c0-8 4-15 10-15s10 7 10 15"/><path d="M15 60c0-5 3-9 7-9s7 4 7 9"/><path d="M32 56c0-5 3-9 7-9s7 4 7 9"/><path d="M55 45l7 22H18l7-22"/><circle cx="55" cy="55" r="3" fill="currentColor"/></svg>',
  '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:80px;height:80px;opacity:0.15;position:absolute;bottom:-8px;right:-8px;color:var(--primary)"><path d="M25 55c0-12 6-22 15-22s15 10 15 22"/><path d="M20 60c0-10 5-18 12-18s12 8 12 18"/><path d="M35 52c0-6 3-11 7-11s7 5 7 11"/><circle cx="36" cy="38" r="2" fill="currentColor"/><circle cx="48" cy="36" r="2" fill="currentColor"/><path d="M28 62l-5-2c-2 1-3 3-2 5l9 3h20l9-3c1-2 0-4-2-5l-5 2"/></svg>',
];

export function renderPlanner(container) {
  const today = new Date();
  const monday = getMonday(today);

  container.innerHTML = `
    <div class="planner-header">
      <h1>Planificador Semanal</h1>
      <p>Organiza tus comidas de la semana</p>
    </div>

    <div class="planner-nav">
      <button id="prevWeek">← Semana anterior</button>
      <span id="weekLabel"></span>
      <button id="nextWeek">Semana siguiente →</button>
      <button class="btn btn-outline" id="regenerateBtn" style="margin-left:auto">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
        Regenerar
      </button>
      <button class="btn btn-primary" id="savePlanBtn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        Guardar plan
      </button>
    </div>

    <div class="planner-summary" id="plannerSummary"></div>

    <div id="plannerAnimWrap">
      <div class="planner-week" id="plannerWeek"></div>

      <div class="planner-banner">
        <div class="planner-banner-bg"></div>
        <div class="planner-banner-content">
          <h3>¿Buscas inspiración?</h3>
          <p>Explora nuevas recetas y agrégalas a tu plan semanal</p>
          <a href="#recipes" class="btn btn-primary btn-sm">Explorar recetas</a>
        </div>
      </div>
    </div>
  `;

  let currentMonday = monday;

  function buildWeekHTML() {
    const saved = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
    let totalMeals = 0;
    let mealTypeCounts = { desayuno: 0, almuerzo: 0, cena: 0, snack: 0 };

    const html = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentMonday);
      date.setDate(currentMonday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      const dayMeals = saved[dateStr] || [];
      const dayName = getDayName(date);
      const dayIndex = date.getDay();

      totalMeals += dayMeals.length;
      dayMeals.forEach(m => {
        if (mealTypeCounts[m.meal_type] !== undefined) mealTypeCounts[m.meal_type]++;
      });

      return `
        <div class="planner-day ${isToday ? 'today' : ''}" data-date="${dateStr}" data-day="${dayName.toLowerCase()}">
          ${DAY_ART[dayIndex]}
          <div class="planner-day-header">
            ${dayName}
            <span class="planner-day-date">${date.getDate()} ${getMonthName(date)}</span>
            ${dayMeals.length ? `<span class="planner-day-count">${dayMeals.length}</span>` : ''}
          </div>
          <div class="planner-day-meals">
            ${dayMeals.length ? dayMeals.map((m, mi) => `
              <div class="planner-meal ${m.meal_type}" data-id="${m.recipe_id}" data-recipe="${m.recipe_name}" data-date="${dateStr}" data-idx="${mi}">
                ${MEAL_ICONS[m.meal_type] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>'}
                <span class="planner-meal-name">${m.recipe_name}</span>
                <button class="planner-meal-remove" data-remove="${dateStr}" data-idx="${mi}" data-name="${m.recipe_name}" title="Eliminar">×</button>
              </div>
            `).join('') : '<div class="planner-empty">Sin comidas</div>'}
          </div>
          <button class="btn btn-outline" style="width:100%;padding:0.3rem;font-size:0.75rem;margin-top:0.4rem;border-radius:6px" data-add="${dateStr}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Agregar
          </button>
        </div>
      `;
    }).join('');

    const totalDays = Object.keys(saved).filter(d => (saved[d] || []).length).length;
    return { html, totalMeals, totalDays, mealTypeCounts };
  }

  function attachWeekEvents() {
    const weekEl = document.getElementById('plannerWeek');
    weekEl.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => openAddModal(btn.dataset.add));
    });
    weekEl.querySelectorAll('.planner-meal').forEach(el => {
      el.addEventListener('click', async (e) => {
        if (e.target.closest('.planner-meal-remove')) return;
        e.stopPropagation();
        const recipeId = el.dataset.id;
        if (!recipeId) return;
        try {
          const recipe = await get(`/recipes/${recipeId}`);
          logUsage('recipe_viewed', recipeId);
          showRecipeDetail(recipe, true);
        } catch {
          const recipeName = el.dataset.recipe;
          if (confirm(`¿Eliminar "${recipeName}" de ${formatDateShort(new Date(dateStr + 'T12:00:00'))}?`)) {
            removeMeal(el.dataset.date, parseInt(el.dataset.idx));
          }
        }
      });
    });
    weekEl.querySelectorAll('.planner-meal-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = btn.dataset.name;
        const dateStr = btn.dataset.remove;
        const idx = parseInt(btn.dataset.idx);
        if (confirm(`¿Eliminar "${name}" de ${formatDateShort(new Date(dateStr + 'T12:00:00'))}?`)) {
          removeMeal(dateStr, idx);
        }
      });
    });
  }

  function removeMeal(dateStr, idx) {
    const saved = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
    if (saved[dateStr]) {
      saved[dateStr].splice(idx, 1);
      if (!saved[dateStr].length) delete saved[dateStr];
      localStorage.setItem('tf_week_plan', JSON.stringify(saved));
      renderWeek();
    }
  }

  function showRecipeDetail(recipe, fromPlanner) {
    const overlay = document.createElement('div');
    overlay.className = 'recipe-detail-overlay';
    overlay.innerHTML = `
      <div class="recipe-detail-card">
        <div class="recipe-detail-header">
          <h2>${recipe.name}</h2>
          <button class="recipe-detail-close" id="detailClose">✕</button>
        </div>

        ${recipe.photo_url ? `
          <div class="recipe-detail-img">
            <img src="${recipe.photo_url}" alt="${recipe.name}" loading="lazy">
          </div>
        ` : ''}

        <div class="recipe-detail-meta">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${recipe.prep_time_minutes || '—'} min
          </span>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            ${recipe.servings || '—'} porciones
          </span>
          ${recipe.diet_tags ? recipe.diet_tags.split(',').map(t => `<span class="tag tag-primary">${t.trim()}</span>`).join('') : ''}
        </div>

        ${recipe.description ? `<p style="margin-bottom:1.5rem;color:var(--text-secondary)">${recipe.description}</p>` : ''}

        ${recipe.ingredients?.length ? `
          <div class="recipe-detail-section">
            <h4>Ingredientes</h4>
            <ul>${recipe.ingredients.map(i => `<li>${i.amount} ${i.unit} de ${i.name}</li>`).join('')}</ul>
          </div>
        ` : ''}

        ${recipe.steps?.length ? `
          <div class="recipe-detail-section">
            <h4>Pasos</h4>
            <ol class="recipe-detail-steps">${recipe.steps.map(s => `<li>${s.instruction}${s.timer_seconds ? ` <span class="tag tag-primary"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.2rem"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${s.timer_seconds}s</span>` : ''}</li>`).join('')}</ol>
          </div>
        ` : ''}

        <div class="recipe-detail-add">
          ${!fromPlanner ? `<button class="btn btn-primary" id="addToPlannerBtn">Agregar al planificador</button>` : ''}
          <button class="btn btn-outline" id="addToFavBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            Favorito
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('detailClose').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    if (!fromPlanner) {
      document.getElementById('addToPlannerBtn').addEventListener('click', () => {
        overlay.remove();
        logUsage('plan_created', recipe.id);
        const prefs = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
        const dates = Object.keys(prefs);
        const firstEmpty = dates.find(d => {
          const dayMeals = prefs[d];
          return !dayMeals || dayMeals.length < 4;
        });
        if (firstEmpty) {
          if (!prefs[firstEmpty]) prefs[firstEmpty] = [];
          prefs[firstEmpty].push({ recipe_id: recipe.id, recipe_name: recipe.name, meal_type: 'almuerzo', plan_date: firstEmpty });
          localStorage.setItem('tf_week_plan', JSON.stringify(prefs));
        }
        window.location.hash = 'planner';
      });
    }

    document.getElementById('addToFavBtn').addEventListener('click', async () => {
      try {
        const { post } = await import('../services/api.js');
        await post('/favorites', { recipe_id: recipe.id });
        logUsage('favorite_added', recipe.id);
        document.getElementById('addToFavBtn').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.3rem"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Agregado';
        document.getElementById('addToFavBtn').disabled = true;
      } catch {
        alert('Error al agregar a favoritos');
      }
    });
  }

  function updateSummary(totalMeals, totalDays, mealTypeCounts) {
    const summaryEl = document.getElementById('plannerSummary');
    if (totalMeals > 0) {
      const typesUsed = Object.entries(mealTypeCounts).filter(([, c]) => c > 0);
      summaryEl.innerHTML = `
        <div class="planner-summary-bar">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.3rem"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <strong>${totalMeals}</strong> comidas · <strong>${totalDays}</strong> días
          </span>
          <span class="planner-summary-types">
            ${typesUsed.map(([t, c]) => `${MEAL_ICONS[t]} ${MEAL_LABELS[t]} ${c}`).join(' · ')}
          </span>
        </div>
      `;
    } else {
      summaryEl.innerHTML = '';
    }
  }

  function renderWeek(direction) {
    const animWrap = document.getElementById('plannerAnimWrap');
    const weekEl = document.getElementById('plannerWeek');
    const weekLabel = document.getElementById('weekLabel');
    const endOfWeek = new Date(currentMonday);
    endOfWeek.setDate(currentMonday.getDate() + 6);

    weekLabel.textContent = `${formatDateShort(currentMonday)} — ${formatDateShort(endOfWeek)}`;

    function applyContent() {
      const { html, totalMeals, totalDays, mealTypeCounts } = buildWeekHTML();
      weekEl.innerHTML = html;
      animWrap.style.animation = '';
      void animWrap.offsetWidth;
      const slideIn = direction === 'next' ? 'slideInRight' : 'slideInLeft';
      animWrap.style.animation = `${slideIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
      updateSummary(totalMeals, totalDays, mealTypeCounts);
      attachWeekEvents();
      document.getElementById('prevWeek').disabled = false;
      document.getElementById('nextWeek').disabled = false;
    }

    if (direction) {
      const slideOut = direction === 'next' ? 'slideOutLeft' : 'slideOutRight';
      animWrap.style.animation = `${slideOut} 0.18s ease forwards`;
      document.getElementById('prevWeek').disabled = true;
      document.getElementById('nextWeek').disabled = true;
      setTimeout(applyContent, 180);
    } else {
      const { html, totalMeals, totalDays, mealTypeCounts } = buildWeekHTML();
      weekEl.innerHTML = html;
      animWrap.style.animation = 'fadeIn 0.3s ease';
      updateSummary(totalMeals, totalDays, mealTypeCounts);
      attachWeekEvents();
    }
  }

  async function openAddModal(dateStr) {
    const modal = document.createElement('div');
    modal.className = 'planner-modal-overlay';
    modal.innerHTML = `
      <div class="planner-modal">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.3rem"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Agregar comida — ${formatDateShort(new Date(dateStr + 'T12:00:00'))}
        </h3>
        <select id="modalMealType">
          <option value="desayuno">Desayuno</option>
          <option value="almuerzo" selected>Almuerzo</option>
          <option value="cena">Cena</option>
          <option value="snack">Snack</option>
        </select>
        <input type="text" id="modalSearch" placeholder="Buscar receta..." />
        <div id="modalResults" style="max-height:280px;overflow-y:auto"></div>
        <div class="planner-modal-actions">
          <button class="btn btn-primary" id="modalAddBtn">Agregar</button>
          <button class="btn btn-outline" id="modalCancelBtn">Cancelar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.getElementById('modalCancelBtn').addEventListener('click', () => modal.remove());

    const resultsEl = document.getElementById('modalResults');
    const searchInput = document.getElementById('modalSearch');

    let selectedRecipe = null;
    let recipesCache = [];

    async function searchRecipes(query) {
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set('search', query.trim());
        params.set('limit', '20');
        const recipes = await get(`/recipes?${params}`);
        recipesCache = recipes;
        resultsEl.innerHTML = recipes.map(r => `
          <div class="planner-modal-recipe" data-id="${r.id}" data-name="${r.name}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" style="flex-shrink:0;color:var(--text-muted)"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            <div><strong>${r.name}</strong><br><small>⏱ ${r.prep_time_minutes || '—'} min</small></div>
          </div>
        `).join('');

        resultsEl.querySelectorAll('.planner-modal-recipe').forEach(el => {
          el.addEventListener('click', () => {
            resultsEl.querySelectorAll('.planner-modal-recipe').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            selectedRecipe = { id: parseInt(el.dataset.id), name: el.dataset.name };
          });
        });
      } catch {
        resultsEl.innerHTML = '<div class="page-error" style="padding:1rem">Error al cargar recetas</div>';
      }
    }

    searchInput.addEventListener('input', () => {
      clearTimeout(window._searchTimer);
      window._searchTimer = setTimeout(() => searchRecipes(searchInput.value), 300);
    });

    await searchRecipes('');

    document.getElementById('modalAddBtn').addEventListener('click', () => {
      if (!selectedRecipe) { alert('Selecciona una receta'); return; }
      const mealType = document.getElementById('modalMealType').value;
      const saved = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
      if (!saved[dateStr]) saved[dateStr] = [];
      saved[dateStr].push({
        recipe_id: selectedRecipe.id,
        recipe_name: selectedRecipe.name,
        meal_type: mealType,
        plan_date: dateStr,
      });
      localStorage.setItem('tf_week_plan', JSON.stringify(saved));
      logUsage('plan_created', selectedRecipe.id);
      modal.remove();
      renderWeek();
    });
  }

  document.getElementById('prevWeek').addEventListener('click', () => {
    currentMonday.setDate(currentMonday.getDate() - 7);
    renderWeek('prev');
  });

  document.getElementById('nextWeek').addEventListener('click', () => {
    currentMonday.setDate(currentMonday.getDate() + 7);
    renderWeek('next');
  });

  document.getElementById('regenerateBtn').addEventListener('click', async () => {
    const { renderQuestionnaire } = await import('./questionnaire.js');
    renderQuestionnaire(container);
  });

  document.getElementById('savePlanBtn').addEventListener('click', async () => {
    try {
      const { post, del } = await import('../services/api.js');
      const saved = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');

      await post('/planner/clear-week', {
        start: currentMonday.toISOString().split('T')[0],
        end: new Date(currentMonday.getTime() + 6 * 86400000).toISOString().split('T')[0],
      });

      for (const [dateStr, meals] of Object.entries(saved)) {
        for (const meal of meals) {
          try {
            await post('/planner', {
              recipe_id: meal.recipe_id,
              plan_date: dateStr,
              meal_type: meal.meal_type,
            });
          } catch {}
        }
      }
      logUsage('plan_saved');
      alert('✅ Plan guardado exitosamente');
    } catch {
      alert('Error al guardar el plan. Verifica que el backend esté corriendo.');
    }
  });

  renderWeek();
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateShort(date) {
  return `${date.getDate()} ${getMonthName(date)}`;
}

function getDayName(date) {
  return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()];
}

function getMonthName(date) {
  return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][date.getMonth()];
}