export function createRecipeCard({ name, calories, time, image }) {
  const card = document.createElement('div');
  card.className = 'recipe-mini-card';

  card.innerHTML = `
    <div class="recipe-mini-thumb">
      ${image
        ? `<img src="${image}" alt="${name}">`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;color:var(--text-muted)"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`}
    </div>
    <div class="recipe-mini-info">
      <div class="recipe-mini-name">${name}</div>
      <div class="recipe-mini-meta">${calories || '—'} kcal · ${time || '—'} min</div>
    </div>`;

  return card;
}
