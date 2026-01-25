/**
 * Input Validation utilities برای امنیت و XSS prevention
 */

// XSS Prevention
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: {
      minLength: password.length < minLength,
      hasUpperCase: !hasUpperCase,
      hasLowerCase: !hasLowerCase,
      hasNumbers: !hasNumbers
    }
  };
};

// Username validation
export const validateUsername = (username) => {
  const minLength = 3;
  const maxLength = 20;
  const validChars = /^[a-zA-Z0-9_]+$/;
  
  return {
    isValid: username.length >= minLength && 
             username.length <= maxLength && 
             validChars.test(username),
    errors: {
      minLength: username.length < minLength,
      maxLength: username.length > maxLength,
      invalidChars: !validChars.test(username)
    }
  };
};

// Comment validation
export const validateComment = (comment) => {
  const minLength = 1;
  const maxLength = 500;
  const sanitized = sanitizeInput(comment.trim());
  
  return {
    isValid: sanitized.length >= minLength && sanitized.length <= maxLength,
    sanitized,
    errors: {
      empty: sanitized.length === 0,
      tooLong: sanitized.length > maxLength
    }
  };
};

// IMDB ID validation
export const validateImdbId = (imdbId) => {
  const imdbRegex = /^tt\d{7,8}$/;
  return imdbRegex.test(imdbId);
};

// Rating validation
export const validateRating = (rating) => {
  const numRating = parseFloat(rating);
  return !isNaN(numRating) && numRating >= 0 && numRating <= 10;
};

// General form validation
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    if (fieldRules.required && (!value || value.toString().trim() === '')) {
      errors[field] = 'این فیلد الزامی است';
      isValid = false;
      return;
    }

    if (fieldRules.email && value && !validateEmail(value)) {
      errors[field] = 'فرمت ایمیل صحیح نیست';
      isValid = false;
    }

    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `حداقل ${fieldRules.minLength} کاراکتر وارد کنید`;
      isValid = false;
    }

    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      errors[field] = `حداکثر ${fieldRules.maxLength} کاراکتر مجاز است`;
      isValid = false;
    }

    if (fieldRules.custom && value) {
      const customResult = fieldRules.custom(value);
      if (!customResult.isValid) {
        errors[field] = customResult.message;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};