import { get } from '../services/api.js';
import { createStatsCard } from '../components/statsCard.js';
import { createRecipeCard } from '../components/recipeCard.js';
import { getUser } from '../services/authService.js';
import { CONFIG } from '../config.js';

export async function renderDashboard(container) {
  const user = getUser();
  const firstName = user?.name?.split(' ')[0] || 'Usuario';

  container.innerHTML = `
    <div class="dashboard-banner">
      <div class="dashboard-banner-bg"></div>
      <div class="dashboard-header">
        <h1>Bienvenido, ${firstName}</h1>
        <p>Resumen nutricional y estadísticas</p>
      </div>
    </div>

    <div class="stats-row" id="statsRow"></div>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <h3>Progreso semanal</h3>
          <span class="tag tag-primary">7 días</span>
        </div>
        <div class="dashboard-card-body">
          <div class="progress-chart">
            <canvas id="progressChart" width="500" height="200"></canvas>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <h3>Comidas de hoy</h3>
          <a href="#planner" class="tag tag-primary" style="cursor:pointer">Ver todo</a>
        </div>
        <div class="dashboard-card-body">
          <div class="meal-list" id="mealList"></div>
        </div>
      </div>
    </div>

    <div class="dashboard-card">
      <div class="dashboard-card-header">
        <h3>Recetas más vistas</h3>
        <span class="tag tag-primary">Ranking</span>
      </div>
      <div class="dashboard-card-body">
        <div class="recipe-mini-list" id="recipeList"></div>
      </div>
    </div>

  `;

  loadStats();
  loadTodayMeals();
  loadRanking();
  setTimeout(() => drawChart(), 100);
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

    const stats = [
      { icon: '📖', iconClass: 'green', value: String(summary.recipes || 0), label: 'Recetas', change: null, changeDir: null },
      { icon: '❤️', iconClass: 'red', value: String(summary.favorites || 0), label: 'Favoritos', change: null, changeDir: null },
      { icon: '📅', iconClass: 'blue', value: String(summary.plannedMeals || 0), label: 'Comidas planificadas', change: null, changeDir: null },
      { icon: '🥕', iconClass: 'orange', value: String(summary.ingredients || 0), label: 'Ingredientes', change: null, changeDir: null },
    ];

    stats.forEach(s => row.appendChild(createStatsCard(s)));
  } catch {
    const fallback = [
      { icon: '📖', iconClass: 'green', value: '—', label: 'Recetas', change: null, changeDir: null },
      { icon: '❤️', iconClass: 'red', value: '—', label: 'Favoritos', change: null, changeDir: null },
      { icon: '📅', iconClass: 'blue', value: '—', label: 'Comidas planificadas', change: null, changeDir: null },
      { icon: '🥕', iconClass: 'orange', value: '—', label: 'Ingredientes', change: null, changeDir: null },
    ];
    fallback.forEach(s => row.appendChild(createStatsCard(s)));
  }
}

function loadTodayMeals() {
  const list = document.getElementById('mealList');
  try {
    const weekPlan = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMeals = weekPlan[todayStr] || [];
    const icons = { desayuno: '🌅', almuerzo: '☀️', cena: '🌙', snack: '🍎' };
    const labels = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', snack: 'Snack' };

    if (todayMeals.length) {
      todayMeals.forEach(m => {
        const item = document.createElement('div');
        item.className = 'meal-item';
        item.innerHTML = `
          <div class="meal-item-icon">${icons[m.meal_type] || '🍽'}</div>
          <div class="meal-item-info">
            <div class="meal-item-name">${labels[m.meal_type] || m.meal_type}</div>
            <div class="meal-item-cal">${m.recipe_name}</div>
          </div>
          <div class="meal-item-time">${m.meal_type}</div>`;
        list.appendChild(item);
      });
    } else {
      list.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.9rem">No hay comidas planificadas para hoy</div>';
    }
  } catch {
    list.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.9rem">No hay comidas planificadas para hoy</div>';
  }
}

async function loadRanking() {
  const list = document.getElementById('recipeList');
  try {
    const ranking = await get('/stats/ranking?limit=4');
    if (ranking.length) {
      ranking.forEach(r => {
        list.appendChild(createRecipeCard({ name: r.name, calories: null, time: `${r.views} vistas` }));
      });
    } else {
      list.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted)">Aún no hay datos de visualización</div>';
    }
  } catch {
    list.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted)">Sin datos</div>';
  }
}

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

  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + chartH * (1 - v / max);
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
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  d.setHours(0, 0, 0, 0);
  return d;
}