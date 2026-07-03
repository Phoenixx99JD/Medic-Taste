export function createRecipeCard({ name, calories, time, image }) {
  const card = document.createElement('div');
  card.className = 'recipe-mini-card';

  card.innerHTML = `
    <div class="recipe-mini-thumb">
      ${image
        ? `<img src="${image}" alt="${name}">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:1.2rem;">🍽️</div>`}
    </div>
    <div class="recipe-mini-info">
      <div class="recipe-mini-name">${name}</div>
      <div class="recipe-mini-meta">${calories || '—'} kcal · ${time || '—'} min</div>
    </div>`;

  return card;
}
