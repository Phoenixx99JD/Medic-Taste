import { get } from '../services/api.js';
import { logUsage } from '../services/usage.js';

function nameToSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function renderRecipes(container) {
  container.innerHTML = `
    <div class="recipes-header">
      <h1>Recetas</h1>
      <div class="recipes-search">
        <input type="text" id="recipeSearch" placeholder="Buscar recetas..." />
        <select id="recipeDiet">
          <option value="">Todas las dietas</option>
          <option value="vegetarian">Vegetariano</option>
          <option value="vegan">Vegano</option>
          <option value="keto">Keto</option>
          <option value="pescatarian">Pescetariano</option>
        </select>
      </div>
    </div>
    <div id="recipesGrid" class="recipes-grid">
      <div class="page-loading">Cargando recetas...</div>
    </div>
  `;

  const grid = document.getElementById('recipesGrid');
  const searchInput = document.getElementById('recipeSearch');
  const dietSelect = document.getElementById('recipeDiet');

  let debounceTimer;

  async function loadRecipes() {
    grid.innerHTML = '<div class="page-loading">Cargando recetas...</div>';
    try {
      const params = new URLSearchParams();
      const search = searchInput.value.trim();
      const diet = dietSelect.value;
      if (search) params.set('search', search);
      if (diet) params.set('diet', diet);

      const recipes = await get(`/recipes?${params}`);

      if (!recipes.length) {
        grid.innerHTML = '<div class="page-loading" style="grid-column:1/-1">No se encontraron recetas.</div>';
        return;
      }

      grid.innerHTML = recipes.map(r => {
        const slug = nameToSlug(r.name);
        const recipeImg = `assets/images/recipes/${slug}.jpg`;
        const recipeImgSvg = `assets/images/recipes/${slug}.svg`;
        return `
        <article class="recipe-card-full" data-id="${r.id}">
          <div class="recipe-card-full-image">
            <img src="${recipeImg}" alt="${r.name}" loading="lazy" onerror="var s=this;if(!s.dataset.f){s.dataset.f=1;s.src='${recipeImgSvg}'}else{s.style.display='none';s.nextElementSibling.style.display='flex'}"><div class="recipe-card-full-image-fallback" style="display:none">🍽️</div>
          </div>
          <div class="recipe-card-full-body">
            <h3>${r.name}</h3>
            <div class="recipe-card-full-meta">
              <span>⏱ ${r.prep_time_minutes || '—'} min</span>
              <span>🍽 ${r.servings || '—'} porc.</span>
            </div>
            ${r.diet_tags ? `<div class="recipe-card-full-tags">${r.diet_tags.split(',').map(t => `<span class="tag tag-primary">${t.trim()}</span>`).join('')}</div>` : ''}
          </div>
        </article>
      `}).join('');

      grid.querySelectorAll('.recipe-card-full').forEach(el => {
        el.addEventListener('click', () => showRecipeDetail(el.dataset.id));
      });
    } catch {
      grid.innerHTML = '<div class="page-error">Error al cargar recetas. Verifica que el backend esté corriendo.</div>';
    }
  }

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(loadRecipes, 300);
  });

  dietSelect.addEventListener('change', loadRecipes);

  loadRecipes();
}

async function showRecipeDetail(id) {
  try {
    const recipe = await get(`/recipes/${id}`);
    logUsage('recipe_viewed', id);
    const slug = nameToSlug(recipe.name);
    const recipeImg = `assets/images/recipes/${slug}.jpg`;
    const recipeImgSvg = `assets/images/recipes/${slug}.svg`;
    const overlay = document.createElement('div');
    overlay.className = 'recipe-detail-overlay';
    overlay.innerHTML = `
      <div class="recipe-detail-card">
        <div class="recipe-detail-image">
          <img src="${recipeImg}" alt="${recipe.name}" loading="lazy" onerror="var s=this;if(!s.dataset.f){s.dataset.f=1;s.src='${recipeImgSvg}'}else{s.style.display='none'}">
        </div>

        <div class="recipe-detail-header">
          <h2>${recipe.name}</h2>
          <button class="recipe-detail-close" id="detailClose">✕</button>
        </div>

        <div class="recipe-detail-meta">
          <span>⏱ ${recipe.prep_time_minutes || '—'} min</span>
          <span>🍽 ${recipe.servings || '—'} porciones</span>
          ${recipe.diet_tags ? recipe.diet_tags.split(',').map(t => `<span class="tag tag-primary">${t.trim()}</span>`).join('') : ''}
        </div>

        ${recipe.description ? `<p style="margin-bottom:1.5rem;color:var(--text-secondary)">${recipe.description}</p>` : ''}

        ${recipe.ingredients?.length ? `
          <div class="recipe-detail-section">
            <h4>Ingredientes</h4>
            <ul>${recipe.ingredients.map(i => {
              const slug = nameToSlug(i.name);
              const img = `assets/images/ingredients/${slug}.jpg`;
              return `<li class="ingredient-item">${i.amount} ${i.unit} de ${i.name}<span class="ingredient-tooltip"><img src="${img}" alt="${i.name}" loading="lazy" onerror="var s=this;var p=s.closest('.ingredient-tooltip');if(!s.dataset.f){s.dataset.f=1;s.src='assets/images/ingredients/${slug}.svg'}else{p.style.display='none'}"></span></li>`;
            }).join('')}</ul>
          </div>
        ` : ''}

        ${recipe.steps?.length ? `
          <div class="recipe-detail-section">
            <h4>Pasos</h4>
            <ol class="recipe-detail-steps">${recipe.steps.map(s => `<li>${s.instruction}${s.timer_seconds ? ` <span class="tag tag-primary">⏱ ${s.timer_seconds}s</span>` : ''}</li>`).join('')}</ol>
          </div>
        ` : ''}

        <div class="recipe-detail-add">
          <button class="btn btn-primary" id="addToPlannerBtn">Agregar al planificador</button>
          <button class="btn btn-outline" id="addToFavBtn">❤️ Favorito</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('detailClose').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

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

    document.getElementById('addToFavBtn').addEventListener('click', async () => {
      try {
        const { post } = await import('../services/api.js');
        await post('/favorites', { recipe_id: recipe.id });
        logUsage('favorite_added', recipe.id);
        document.getElementById('addToFavBtn').textContent = '❤️ Agregado';
        document.getElementById('addToFavBtn').disabled = true;
      } catch {
        alert('Error al agregar a favoritos');
      }
    });

  } catch {
    alert('Error al cargar la receta');
  }
}