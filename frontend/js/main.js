import { renderDashboard } from './pages/dashboard.js';
import { hasCompletedQuestionnaire } from './pages/questionnaire.js';
import { renderRecipes } from './pages/recipes.js';
import { renderPlanner } from './pages/planner.js';
import { renderFavorites } from './pages/favorites.js';
import { renderShopping } from './pages/shopping.js';
import { renderProfile } from './pages/profile.js';
import { getUser, isAuthenticated, logout } from './services/authService.js';

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
const sidebarClose = document.getElementById('sidebarClose');
const pageContent = document.getElementById('pageContent');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');

if (!isAuthenticated()) {
  window.location.href = '/login.html';
}

function toggleSidebar(open) {
  sidebar.classList.toggle('open', open);
  sidebarOverlay.classList.toggle('open', open);
}

menuToggle.addEventListener('click', () => toggleSidebar(true));
sidebarClose.addEventListener('click', () => toggleSidebar(false));
sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

const user = getUser();
if (user) {
  userName.textContent = user.name || 'Usuario';
  userEmail.textContent = user.email || '';
  userAvatar.textContent = (user.name || 'U')[0].toUpperCase();
}

const routes = {
  dashboard: renderDashboard,
  recipes: renderRecipes,
  planner: renderPlanner,
  favorites: renderFavorites,
  shopping: renderShopping,
  profile: renderProfile,
};

function getPageFromHash() {
  return window.location.hash.replace('#', '') || 'dashboard';
}

function navigate(page) {
  sidebarLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  toggleSidebar(false);

  const render = routes[page];
  if (render) {
    pageContent.innerHTML = '';
    render(pageContent);
  } else {
    pageContent.innerHTML = `
      <div style="text-align:center;padding:4rem 1rem;color:var(--text-secondary);">
        <h2>Próximamente</h2>
        <p>La vista "${page}" está en desarrollo.</p>
      </div>`;
  }
}

sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    window.location.hash = page;
  });
});

if (!hasCompletedQuestionnaire()) {
  window.location.href = '/onboarding.html';
}

window.addEventListener('hashchange', () => {
  navigate(getPageFromHash());
});

navigate(getPageFromHash());
