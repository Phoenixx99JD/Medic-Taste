import { get, del } from '../services/api.js';

export async function renderFavorites(container) {
  container.innerHTML = `
    <div class="favorites-header">
      <h1>❤️ Favoritos</h1>
    </div>
    <div id="favGrid" class="recipes-grid">
      <div class="page-loading">Cargando favoritos...</div>
    </div>
  `;

  try {
    const favorites = await get('/favorites');

    const grid = document.getElementById('favGrid');

    if (!favorites.length) {
      grid.innerHTML = `
        <div class="favorites-empty">
          <div class="icon">❤️</div>
          <h3>Sin favoritos aún</h3>
          <p>Explora recetas y agrega tus favoritas.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = favorites.map(f => `
      <article class="recipe-card-full" data-id="${f.recipe_id}">
        <div class="recipe-card-full-image">🍽️</div>
        <div class="recipe-card-full-body">
          <h3>${f.name || 'Receta'}</h3>
          <button class="btn btn-outline" style="width:100%;margin-top:0.75rem;font-size:0.8rem" data-remove="${f.recipe_id}">Quitar de favoritos</button>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await del(`/favorites/${btn.dataset.remove}`);
          btn.closest('.recipe-card-full').remove();
          if (!grid.querySelector('.recipe-card-full')) {
            grid.innerHTML = `
              <div class="favorites-empty">
                <div class="icon">❤️</div>
                <h3>Sin favoritos aún</h3>
                <p>Explora recetas y agrega tus favoritas.</p>
              </div>
            `;
          }
        } catch {
          alert('Error al quitar de favoritos');
        }
      });
    });

  } catch {
    container.innerHTML = `
      <div class="favorites-header">
        <h1>❤️ Favoritos</h1>
      </div>
      <div class="page-error">Error al cargar favoritos. Verifica que el backend esté corriendo.</div>
    `;
  }
}