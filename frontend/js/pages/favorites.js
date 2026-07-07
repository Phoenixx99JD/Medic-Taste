import { get, del } from '../services/api.js';

export async function renderFavorites(container) {
  container.innerHTML = `
    <div class="favorites-header">
      <h1>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.4rem;color:var(--error)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Favoritos
      </h1>
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
          <div class="icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <h3>Sin favoritos aún</h3>
          <p>Explora recetas y agrega tus favoritas.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = favorites.map(f => `
      <article class="recipe-card-full" data-id="${f.recipe_id}">
        <div class="recipe-card-full-image">
          ${f.photo_url
            ? `<img src="${f.photo_url}" alt="${f.name || 'Receta'}" loading="lazy">`
            : `<div class="recipe-card-full-placeholder">${(f.name || 'R').charAt(0).toUpperCase()}</div>`
          }
        </div>
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
                <div class="icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </div>
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
      <h1>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.4rem;color:var(--error)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Favoritos
      </h1>
    </div>
    <div class="page-error">Error al cargar favoritos. Verifica que el backend esté corriendo.</div>
  `;
  }
}