import { post, get } from './api.js';
import { CONFIG } from '../config.js';

export async function login(email, password) {
  const data = await post('/auth/login', { email, password });
  localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.token);
  localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.user));
  return data;
}

export async function register(name, email, password) {
  const data = await post('/auth/register', { name, email, password });
  localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.token);
  localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.user));
  return data;
}

export async function getMe() {
  return get('/auth/me');
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
