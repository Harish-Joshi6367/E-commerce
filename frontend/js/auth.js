import { apiFetch } from './api.js';

async function login(email, password) {
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

function saveToken(token) {
  localStorage.setItem('token', token);
}
function logout() {
  localStorage.removeItem('token');
}
function getToken() {
  return localStorage.getItem('token');
}

export { login, saveToken, logout, getToken };
