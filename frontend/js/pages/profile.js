import { getUser, logout } from '../services/authService.js';
import { loadPreferences, hasCompletedQuestionnaire } from './questionnaire.js';

export function renderProfile(container) {
  const user = getUser();
  const prefs = loadPreferences();
  const done = hasCompletedQuestionnaire();

  container.innerHTML = `
    <div class="profile-header">
      <h1>👤 Perfil</h1>
    </div>

    <div class="profile-card">
      <div class="profile-card-field">
        <label>Nombre</label>
        <p>${user?.name || '—'}</p>
      </div>
      <div class="profile-card-field">
        <label>Email</label>
        <p>${user?.email || '—'}</p>
      </div>

      ${done && prefs ? `
        <div class="profile-preferences">
          <h3>Preferencias alimenticias</h3>
          <div class="profile-pref-tags">
            ${prefs.diet ? `<span class="tag tag-primary">${getDietLabel(prefs.diet)}</span>` : ''}
            ${prefs.goal ? `<span class="tag tag-success">${getGoalLabel(prefs.goal)}</span>` : ''}
            ${prefs.meals ? `<span class="tag tag-primary">${prefs.meals} comidas/día</span>` : ''}
            ${prefs.cookTime ? `<span class="tag tag-primary">${getCookTimeLabel(prefs.cookTime)}</span>` : ''}
            ${Array.isArray(prefs.allergies) ? prefs.allergies.filter(a => a !== 'none').map(a => `<span class="tag" style="background:var(--error-light);color:var(--error)">🚫 ${a}</span>`).join('') : ''}
          </div>
        </div>
      ` : `
        <div class="profile-preferences">
          <h3>Preferencias alimenticias</h3>
          <p style="color:var(--text-secondary);font-size:0.9rem">No has realizado el cuestionario aún.</p>
          <button class="btn btn-primary" id="goToQuestionnaire" style="margin-top:0.75rem">Comenzar cuestionario</button>
        </div>
      `}

      <div class="profile-actions">
        <button class="btn btn-outline" id="redoQuestionnaire">🔄 Repetir cuestionario</button>
        <button class="btn btn-outline" id="logoutBtn" style="color:var(--error);border-color:var(--error)">Cerrar sesión</button>
      </div>
    </div>
  `;

  document.getElementById('redoQuestionnaire')?.addEventListener('click', () => {
    localStorage.removeItem('tf_questionnaire_done');
    window.location.href = '/onboarding.html';
  });

  document.getElementById('goToQuestionnaire')?.addEventListener('click', () => {
    window.location.href = '/onboarding.html';
  });

  document.getElementById('logoutBtn').addEventListener('click', logout);
}

function getDietLabel(val) {
  const labels = { omnivore: 'Omnívoro', vegetarian: 'Vegetariano', vegan: 'Vegano', keto: 'Keto', pescatarian: 'Pescetariano' };
  return labels[val] || val;
}

function getGoalLabel(val) {
  const labels = { lose: 'Perder peso', maintain: 'Mantener peso', gain: 'Ganar músculo', energy: 'Más energía' };
  return labels[val] || val;
}

function getCookTimeLabel(val) {
  const labels = { quick: 'Rápido', moderate: 'Moderado', elaborate: 'Elaborado' };
  return labels[val] || val;
}