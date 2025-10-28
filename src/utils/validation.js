/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's between 10-15 digits
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate required field
 * @param {*} value - Value to check
 * @returns {boolean} Is not empty
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate min length
 * @param {string} value - Value to check
 * @param {number} min - Minimum length
 * @returns {boolean} Meets min length
 */
export const minLength = (value, min) => {
  return value.length >= min;
};

/**
 * Validate max length
 * @param {string} value - Value to check
 * @param {number} max - Maximum length
 * @returns {boolean} Meets max length
 */
export const maxLength = (value, max) => {
  return value.length <= max;
};

/**
 * Validate form data
 * @param {Object} data - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation errors
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = data[field];

    fieldRules.forEach((rule) => {
      if (rule.required && !isRequired(value)) {
        errors[field] = rule.message || `${field} is required`;
      } else if (value) {
        if (rule.minLength && !minLength(value, rule.minLength)) {
          errors[field] = rule.message || `Minimum length is ${rule.minLength}`;
        }
        if (rule.maxLength && !maxLength(value, rule.maxLength)) {
          errors[field] = rule.message || `Maximum length is ${rule.maxLength}`;
        }
        if (rule.email && !isValidEmail(value)) {
          errors[field] = rule.message || 'Invalid email address';
        }
        if (rule.phone && !isValidPhone(value)) {
          errors[field] = rule.message || 'Invalid phone number';
        }
        if (rule.url && !isValidURL(value)) {
          errors[field] = rule.message || 'Invalid URL';
        }
      }
    });
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export default {
  isValidEmail,
  isValidPhone,
  isValidURL,
  isRequired,
  minLength,
  maxLength,
  validateForm,
};
