// Validation utility functions

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters",
    };
  }

  return { isValid: true, message: "Password is valid" };
};

// Validate URL format
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate required field
export const isRequired = (value) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Validate string length (min/max)
export const validateLength = (value, min, max) => {
  const length = value?.length || 0;

  if (min && length < min) {
    return { isValid: false, message: `Must be at least ${min} characters` };
  }

  if (max && length > max) {
    return {
      isValid: false,
      message: `Must be no more than ${max} characters`,
    };
  }

  return { isValid: true, message: "Valid length" };
};
