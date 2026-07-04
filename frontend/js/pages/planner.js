import { get } from '../services/api.js';
import { logUsage } from '../services/usage.js';

const MEAL_ICONS = { desayuno: '🌅', almuerzo: '☀️', cena: '🌙', snack: '🍎' };
const MEAL_LABELS = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', snack: 'Snack' };

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
      <button class="btn btn-outline" id="regenerateBtn" style="margin-left:auto">🔄 Regenerar</button>
      <button class="btn btn-primary" id="savePlanBtn">💾 Guardar plan</button>
    </div>

    <div class="planner-summary" id="plannerSummary"></div>

    <div class="planner-week" id="plannerWeek"></div>
  `;

  let currentMonday = monday;

  function renderWeek() {
    const weekEl = document.getElementById('plannerWeek');
    const weekLabel = document.getElementById('weekLabel');
    const summaryEl = document.getElementById('plannerSummary');
    const endOfWeek = new Date(currentMonday);
    endOfWeek.setDate(currentMonday.getDate() + 6);

    weekLabel.textContent = `${formatDateShort(currentMonday)} — ${formatDateShort(endOfWeek)}`;

    const saved = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');

    let totalMeals = 0;
    let mealTypeCounts = { desayuno: 0, almuerzo: 0, cena: 0, snack: 0 };

    weekEl.innerHTML = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentMonday);
      date.setDate(currentMonday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      const dayMeals = saved[dateStr] || [];
      const dayName = getDayName(date);

      totalMeals += dayMeals.length;
      dayMeals.forEach(m => {
        if (mealTypeCounts[m.meal_type] !== undefined) mealTypeCounts[m.meal_type]++;
      });

      return `
        <div class="planner-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
          <div class="planner-day-header">
            ${dayName}
            <span class="planner-day-date">${date.getDate()} ${getMonthName(date)}</span>
            ${dayMeals.length ? `<span class="planner-day-count">${dayMeals.length}</span>` : ''}
          </div>
          ${dayMeals.length ? dayMeals.map(m => `
            <div class="planner-meal ${m.meal_type}" data-recipe="${m.recipe_name}" data-date="${dateStr}" data-idx="${dayMeals.indexOf(m)}">
              ${MEAL_ICONS[m.meal_type] || '🍽'} ${m.recipe_name}
            </div>
          `).join('') : '<div class="planner-empty">Vacío</div>'}
          <button class="btn btn-outline" style="width:100%;padding:0.35rem;font-size:0.8rem;margin-top:0.5rem" data-add="${dateStr}">+ Agregar</button>
        </div>
      `;
    }).join('');

    const totalDays = Object.keys(saved).filter(d => (saved[d] || []).length).length;

    if (totalMeals > 0) {
      const typesUsed = Object.entries(mealTypeCounts).filter(([, c]) => c > 0);
      summaryEl.innerHTML = `
        <div class="planner-summary-bar">
          <span>📊 <strong>${totalMeals}</strong> comidas esta semana · <strong>${totalDays}</strong> días con plan</span>
          <span class="planner-summary-types">
            ${typesUsed.map(([t, c]) => `${MEAL_ICONS[t]} ${MEAL_LABELS[t]} ${c}`).join(' · ')}
          </span>
        </div>
      `;
    } else {
      summaryEl.innerHTML = '';
    }

    weekEl.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => openAddModal(btn.dataset.add));
    });

    weekEl.querySelectorAll('.planner-meal').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const dateStr = el.dataset.date;
        const idx = parseInt(el.dataset.idx);
        const recipeName = el.dataset.recipe;
        if (confirm(`¿Eliminar "${recipeName}" de ${formatDateShort(new Date(dateStr + 'T12:00:00'))}?`)) {
          const saved = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
          if (saved[dateStr]) {
            saved[dateStr].splice(idx, 1);
            if (!saved[dateStr].length) delete saved[dateStr];
            localStorage.setItem('tf_week_plan', JSON.stringify(saved));
            renderWeek();
          }
        }
      });
    });
  }

  async function openAddModal(dateStr) {
    const modal = document.createElement('div');
    modal.className = 'planner-modal-overlay';
    modal.innerHTML = `
      <div class="planner-modal">
        <h3>Agregar comida — ${formatDateShort(new Date(dateStr + 'T12:00:00'))}</h3>
        <select id="modalMealType">
          <option value="desayuno">🌅 Desayuno</option>
          <option value="almuerzo" selected>☀️ Almuerzo</option>
          <option value="cena">🌙 Cena</option>
          <option value="snack">🍎 Snack</option>
        </select>
        <input type="text" id="modalSearch" placeholder="Buscar receta..." />
        <div id="modalResults" style="max-height:300px;overflow-y:auto"></div>
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
            <span style="font-size:1.5rem">🍽️</span>
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
    renderWeek();
  });

  document.getElementById('nextWeek').addEventListener('click', () => {
    currentMonday.setDate(currentMonday.getDate() + 7);
    renderWeek();
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