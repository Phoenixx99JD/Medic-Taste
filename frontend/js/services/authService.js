import { post, put, del, get } from './api.js';
import { CONFIG } from '../config.js';

export async function login(email, password) {
  const data = await post('/auth/login', { email, password });
  localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.token);
  localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.user));
  if (!data.user.onboarding_completed) localStorage.removeItem('tf_questionnaire_done');
  return data;
}

export async function register(name, email, password) {
  const data = await post('/auth/register', { name, email, password });
  localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.token);
  localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.user));
  if (!data.user.onboarding_completed) localStorage.removeItem('tf_questionnaire_done');
  return data;
}

export async function getMe() {
  return get('/auth/me');
}

export async function completeOnboarding() {
  const data = await put('/auth/onboarding');
  const user = getUser();
  if (user) {
    user.onboarding_completed = 1;
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  }
  return data;
}

export async function resetOnboarding() {
  const data = await del('/auth/onboarding');
  const user = getUser();
  if (user) {
    user.onboarding_completed = 0;
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  }
  return data;
}

export function logout() {
  localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
  localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
  window.location.href = '/login.html';
}

export function getUser() {
  try {
    const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
}
