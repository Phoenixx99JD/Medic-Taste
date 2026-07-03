export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function minLength(min) {
  return (value) => typeof value === 'string' && value.trim().length >= min;
}

export function isPassword(value) {
  return value.length >= 6;
}

export function validateField(value, rules) {
  for (const rule of rules) {
    if (!rule(value)) {
      return false;
    }
  }
  return true;
}

export function getValidationErrors(data, fields) {
  const errors = {};
  for (const [field, rules] of Object.entries(fields)) {
    if (!validateField(data[field], rules)) {
      errors[field] = true;
    }
  }
  return errors;
}
