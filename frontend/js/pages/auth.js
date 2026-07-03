import { login, register, getUser } from '../services/authService.js';
import { isEmail, isNotEmpty, isPassword } from '../utils/validators.js';

const isLoginPage = window.location.pathname.includes('login');
const form = document.getElementById(isLoginPage ? 'loginForm' : 'registerForm');
const submitBtn = document.getElementById('submitBtn');
const formAlert = document.getElementById('formAlert');
const passwordToggle = document.getElementById('passwordToggle');

function showError(msg) {
  formAlert.textContent = msg;
  formAlert.className = 'form-alert error show';
}

function clearError() {
  formAlert.textContent = '';
  formAlert.className = 'form-alert';
}

function validateField(id, validator) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(`${id}Error`);
  const valid = validator(input.value);

  if (input.value && !valid) {
    input.classList.add('error');
    if (errorEl) errorEl.classList.add('show');
  } else {
    input.classList.remove('error');
    if (errorEl) errorEl.classList.remove('show');
  }

  return input.value ? valid : true;
}

function validateForm(data) {
  let valid = true;

  if (data.name !== undefined) {
    valid = validateField('name', isNotEmpty) && valid;
  }
  valid = validateField('email', isEmail) && valid;
  valid = validateField('password', isPassword) && valid;

  return valid;
}

if (passwordToggle) {
  passwordToggle.addEventListener('click', () => {
    const input = document.getElementById('password');
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    passwordToggle.textContent = type === 'password' ? '👁️' : '🙈';
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const data = {
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
  };

  if (!isLoginPage) {
    data.name = document.getElementById('name').value.trim();
  }

  if (!validateForm(data)) {
    showError('Corrige los campos marcados en rojo');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = isLoginPage ? 'Ingresando...' : 'Creando cuenta...';

  try {
    if (isLoginPage) {
      await login(data.email, data.password);
    } else {
      await register(data.name, data.email, data.password);
    }
    const user = getUser();
    if (user && user.onboarding_completed) {
      window.location.href = '/app.html';
    } else {
      window.location.href = '/onboarding.html';
    }
  } catch (err) {
    showError(err.message || 'Error al procesar la solicitud');
    submitBtn.disabled = false;
    submitBtn.textContent = isLoginPage ? 'Iniciar sesión' : 'Crear cuenta';
  }
});

[document.getElementById('email'), document.getElementById('password')].forEach(el => {
  if (el) {
    el.addEventListener('input', () => validateField(el.id, el.id === 'email' ? isEmail : isPassword));
  }
});

if (!isLoginPage) {
  const nameInput = document.getElementById('name');
  if (nameInput) {
    nameInput.addEventListener('input', () => validateField('name', isNotEmpty));
  }
}
