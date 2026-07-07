import { get } from '../services/api.js';
import { getUser } from '../services/authService.js';

export async function renderDashboard(container) {
  const user = getUser();
  const firstName = user?.name?.split(' ')[0] || 'Usuario';

  container.innerHTML = `
    <div class="dashboard-banner">
      <div class="dashboard-banner-decoration"></div>
      <div class="dashboard-banner-content">
        <h1>Bienvenido, ${firstName}</h1>
        <p>Resumen de tu actividad nutricional</p>
      </div>
    </div>

    <div class="stats-row" id="statsRow"></div>

    <div class="quick-access">
      <h2>Acceso rápido</h2>
      <div class="quick-access-grid">
        <a href="#planner" class="quick-card" data-page="planner">
          <div class="quick-card-icon" style="background:#E0F2F1;color:#00897B">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path>
              <path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path>
            </svg>
          </div>
          <span>Planificador <small>Organiza tu semana</small></span>
        </a>
        <a href="#favorites" class="quick-card" data-page="favorites">
          <div class="quick-card-icon" style="background:#FFEBEE;color:#DC2626">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span>Favoritos <small>Tus recetas guardadas</small></span>
        </a>
        <a href="#shopping" class="quick-card" data-page="shopping">
          <div class="quick-card-icon" style="background:#FFF8E1;color:#F59E0B">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <span>Lista de compras <small>Tus ingredientes</small></span>
        </a>
        <a href="#profile" class="quick-card" data-page="profile">
          <div class="quick-card-icon" style="background:#E3F2FD;color:#1565C0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span>Perfil <small>Tu información</small></span>
        </a>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <h3>Progreso semanal</h3>
          <span class="tag tag-primary" style="font-size:0.72rem">7 días</span>
        </div>
        <div class="dashboard-card-body">
          <div class="progress-chart">
            <canvas id="progressChart" width="500" height="200"></canvas>
          </div>
          <div class="progress-summary" id="progressSummary"></div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <h3>Comidas de hoy</h3>
          <a href="#planner" style="font-size:0.75rem;color:var(--primary);font-weight:500">Ver todo</a>
        </div>
        <div class="dashboard-card-body">
          <div class="meal-list" id="mealList"></div>
        </div>
      </div>
    </div>

    <div class="section-label">
      Recetas más vistas
      <a href="#recipes">Ver todas</a>
    </div>
    <div class="recipe-mini-list" id="recipeList"></div>

  `;

  loadStats();
  loadTodayMeals();
  loadRanking();
  setTimeout(() => { drawChart(); setupChartClick(document.getElementById('progressChart')); }, 100);

  container.querySelectorAll('.quick-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const page = card.dataset.page;
      if (page) window.location.hash = page;
    });
  });
}

async function loadStats() {
  const row = document.getElementById('statsRow');
  try {
    const [summary, daily] = await Promise.all([
      get('/stats/summary'),
      get('/stats/daily?days=7'),
    ]);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayActions = Array.isArray(daily) ? daily.filter(d => d.date === todayStr) : [];
    const todayViews = todayActions.filter(d => d.action_type === 'recipe_viewed').reduce((s, d) => s + d.count, 0);
    const todayPlans = todayActions.filter(d => d.action_type === 'plan_created').reduce((s, d) => s + d.count, 0);

    const icons = {
      recipes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
      favorites: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
      planned: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      ingredients: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    };

    const stats = [
      { icon: icons.recipes, iconClass: 'green', value: String(summary.recipes || 0), label: 'Recetas' },
      { icon: icons.favorites, iconClass: 'red', value: String(summary.favorites || 0), label: 'Favoritos' },
      { icon: icons.planned, iconClass: 'blue', value: String(summary.plannedMeals || 0), label: 'Comidas planificadas' },
      { icon: icons.ingredients, iconClass: 'orange', value: String(summary.ingredients || 0), label: 'Ingredientes' },
    ];

    stats.forEach(s => row.appendChild(createStatCard(s)));
  } catch {
    const fallbackIcons = {
      recipes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
      favorites: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
      planned: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      ingredients: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    };
    const fallback = [
      { icon: fallbackIcons.recipes, iconClass: 'green', value: '—', label: 'Recetas' },
      { icon: fallbackIcons.favorites, iconClass: 'red', value: '—', label: 'Favoritos' },
      { icon: fallbackIcons.planned, iconClass: 'blue', value: '—', label: 'Comidas planificadas' },
      { icon: fallbackIcons.ingredients, iconClass: 'orange', value: '—', label: 'Ingredientes' },
    ];
    fallback.forEach(s => row.appendChild(createStatCard(s)));
  }
}

function createStatCard({ icon, iconClass, value, label }) {
  const card = document.createElement('div');
  card.className = 'stat-card';
  card.innerHTML = `
    <div class="stat-card-icon ${iconClass}">${icon}</div>
    <div class="stat-card-body">
      <div class="stat-card-value">${value}</div>
      <div class="stat-card-label">${label}</div>
    </div>`;
  return card;
}

function loadTodayMeals() {
  const list = document.getElementById('mealList');
  try {
    const weekPlan = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMeals = weekPlan[todayStr] || [];
    const mealSvg = {
      desayuno: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
      almuerzo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M2 12h20"></path><path d="M2 18h20"></path><path d="M2 6h20"></path></svg>`,
      cena: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M3 3l18 18"></path><path d="M21 3l-18 18"></path></svg>`,
      snack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    };
    const labels = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', snack: 'Snack' };
    const shortLabels = { desayuno: 'Des', almuerzo: 'Alm', cena: 'Cen', snack: 'Snack' };

    if (todayMeals.length) {
      todayMeals.forEach(m => {
        const item = document.createElement('div');
        item.className = 'meal-item';
        item.innerHTML = `
          <div class="meal-item-icon">${mealSvg[m.meal_type] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>'}</div>
          <div class="meal-item-info">
            <div class="meal-item-name">${labels[m.meal_type] || m.meal_type}</div>
            <div class="meal-item-cal">${m.recipe_name}</div>
          </div>
          <div class="meal-item-time">${shortLabels[m.meal_type] || m.meal_type}</div>`;
        list.appendChild(item);
      });
    } else {
      list.innerHTML = '<div style="text-align:center;padding:2rem 0;color:var(--text-muted);font-size:0.85rem">No hay comidas planificadas para hoy</div>';
    }
  } catch {
    list.innerHTML = '<div style="text-align:center;padding:2rem 0;color:var(--text-muted);font-size:0.85rem">No hay comidas planificadas para hoy</div>';
  }
}

async function loadRanking() {
  const list = document.getElementById('recipeList');
  try {
    const ranking = await get('/stats/ranking?limit=4');
    if (ranking.length) {
      ranking.forEach(r => {
        const card = document.createElement('div');
        card.className = 'recipe-mini-card';
        card.innerHTML = `
          <div class="recipe-mini-thumb">
            ${r.photo_url
              ? `<img src="${r.photo_url}" alt="${r.name}" loading="lazy">`
              : `<div class="recipe-mini-placeholder">${r.name.charAt(0).toUpperCase()}</div>`
            }
          </div>
          <div class="recipe-mini-info">
            <div class="recipe-mini-name">${r.name}</div>
            <div class="recipe-mini-meta">${r.views || 0} vistas</div>
          </div>`;
        list.appendChild(card);
      });
    } else {
      list.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);font-size:0.85rem">Aún no hay datos de visualización</div>';
    }
  } catch {
    list.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);font-size:0.85rem">Sin datos</div>';
  }
}

let chartPoints = [];

function drawChart() {
  const canvas = document.getElementById('progressChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padding = 20;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const weekPlan = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
  const monday = getMonday(new Date());
  const values = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const ds = d.toISOString().split('T')[0];
    const meals = weekPlan[ds] || [];
    return meals.length;
  });
  const max = Math.max(5, ...values);

  const stepX = chartW / (days.length - 1);

  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = '#E9F0EE';
  ctx.lineWidth = 1;
  [0, 0.25, 0.5, 0.75, 1].forEach(f => {
    const y = padding + chartH * (1 - f);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
  });

  ctx.beginPath();
  ctx.moveTo(padding, padding + chartH);
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + chartH * (1 - v / max);
    i === 0 ? ctx.lineTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(padding + (values.length - 1) * stepX, padding + chartH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, padding, 0, padding + chartH);
  grad.addColorStop(0, 'rgba(0, 137, 123, 0.2)');
  grad.addColorStop(1, 'rgba(0, 137, 123, 0.02)');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = '#00897B';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + chartH * (1 - v / max);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  chartPoints = [];
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + chartH * (1 - v / max);
    chartPoints.push({ x, y, day: days[i], value: v, index: i });
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00897B';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 137, 123, 0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  ctx.fillStyle = '#6B7280';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  days.forEach((d, i) => {
    const x = padding + i * stepX;
    ctx.fillText(d, x, h - 6);
  });

  ctx.fillStyle = '#00897B';
  ctx.font = 'bold 12px Inter, sans-serif';
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + chartH * (1 - v / max) - 10;
    ctx.fillText(v > 0 ? v : '', x, y);
  });

  const total = values.reduce((a, b) => a + b, 0);
  const avg = (total / 7).toFixed(1);
  const maxVal = Math.max(...values);
  const bestDay = days[values.indexOf(maxVal)];
  const sum = document.getElementById('progressSummary');
  if (sum) {
    sum.innerHTML = `
      <div class="progress-stat"><span class="progress-stat-value">${total}</span><span class="progress-stat-label">Total comidas</span></div>
      <div class="progress-stat"><span class="progress-stat-value">${avg}</span><span class="progress-stat-label">Promedio/día</span></div>
      <div class="progress-stat"><span class="progress-stat-value">${maxVal > 0 ? maxVal : '—'}</span><span class="progress-stat-label">${maxVal > 0 ? 'Mejor día' : 'Sin datos'}</span></div>
      <div class="progress-stat"><span class="progress-stat-value">${maxVal > 0 ? bestDay : '—'}</span><span class="progress-stat-label">${maxVal > 0 ? 'Día pico' : ''}</span></div>
    `;
  }
}

let chartTooltip = null;

function removeChartTooltip() {
  if (chartTooltip) { chartTooltip.remove(); chartTooltip = null; }
}

function setupChartClick(canvas) {
  canvas.addEventListener('click', function (e) {
    removeChartTooltip();
    const rect = this.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let closest = null, minDist = Infinity;
    chartPoints.forEach(p => {
      const d = Math.hypot(mx - p.x, my - p.y);
      if (d < minDist) { minDist = d; closest = p; }
    });
    if (!closest || minDist > 30) return;
    const tip = document.createElement('div');
    tip.className = 'chart-tooltip';
    const ds = closest.day;
    const shortNames = { Lun: 'lunes', Mar: 'martes', Mié: 'miércoles', Jue: 'jueves', Vie: 'viernes', Sáb: 'sábado', Dom: 'domingo' };
    const dayName = shortNames[ds] || ds;
    const comida = closest.value === 1 ? 'comida' : 'comidas';
    tip.innerHTML = `
      <strong>${ds}</strong><br>
      <span style="font-size:0.85rem">${closest.value} ${comida} planificadas</span>
      <a href="#planner" class="chart-tooltip-link">Ir al planificador →</a>
    `;
    const parent = canvas.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(tip);
    const posX = closest.x + 10;
    const tipW = 160;
    const parentRect = parent.getBoundingClientRect();
    const adjustedX = Math.min(posX, parentRect.width - tipW - 10);
    tip.style.left = Math.max(10, adjustedX) + 'px';
    tip.style.top = (closest.y - 20) + 'px';
    chartTooltip = tip;
  });
  canvas.addEventListener('mouseleave', removeChartTooltip);
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  d.setHours(0, 0, 0, 0);
  return d;
}
