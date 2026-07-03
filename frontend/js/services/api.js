import { CONFIG } from '../config.js';

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${CONFIG.API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data.message || data.error || 'Error en la solicitud');
  }

  return data;
}

export function get(endpoint) {
  return request(endpoint, { method: 'GET' });
}

export function post(endpoint, body) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function put(endpoint, body) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function del(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}

export { ApiError };
