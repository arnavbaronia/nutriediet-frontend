import { VALIDATION } from './constants';

/**
 * Validates password strength based on security requirements
 * Requirements:
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - Not a common weak password
 * 
 * @param {string} password - The password to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  // Check if password exists
  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required'],
    };
  }

  // Check minimum length
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long`);
  }

  // Check maximum length (prevent DoS attacks with very long passwords)
  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    errors.push(`Password must not exceed ${VALIDATION.MAX_PASSWORD_LENGTH} characters`);
  }

  // Check for uppercase letter
  if (!VALIDATION.PASSWORD_REQUIREMENTS.UPPERCASE.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letter
  if (!VALIDATION.PASSWORD_REQUIREMENTS.LOWERCASE.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for number
  if (!VALIDATION.PASSWORD_REQUIREMENTS.NUMBER.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special character
  if (!VALIDATION.PASSWORD_REQUIREMENTS.SPECIAL_CHAR.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>_-+=[]\\\\\\//;\'~`)');
  }

  // Check for common weak passwords
  const passwordLower = password.toLowerCase();
  const isWeak = VALIDATION.WEAK_PASSWORDS.some((weak) =>
    passwordLower.includes(weak.toLowerCase())
  );

  if (isWeak) {
    errors.push('Password is too common, please choose a stronger password');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Gets a user-friendly message about password requirements
 * @returns {string} - Password requirements message
 */
export const getPasswordRequirements = () => {
  return `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long and contain: uppercase letter, lowercase letter, number, and special character (!@#$%^&*(),.?":{}|<>_-+=[]\\\\\\//;'~\`)`;
};

/**
 * Gets password strength level (for progress indicators)
 * @param {string} password - The password to check
 * @returns {Object} - { strength: string, score: number, feedback: string[] }
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { strength: 'none', score: 0, feedback: [] };
  }

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length >= VALIDATION.MIN_PASSWORD_LENGTH) {
    score += 25;
  } else {
    feedback.push(`Add ${VALIDATION.MIN_PASSWORD_LENGTH - password.length} more characters`);
  }

  // Character variety checks
  if (VALIDATION.PASSWORD_REQUIREMENTS.UPPERCASE.test(password)) {
    score += 15;
  } else {
    feedback.push('Add an uppercase letter');
  }

  if (VALIDATION.PASSWORD_REQUIREMENTS.LOWERCASE.test(password)) {
    score += 15;
  } else {
    feedback.push('Add a lowercase letter');
  }

  if (VALIDATION.PASSWORD_REQUIREMENTS.NUMBER.test(password)) {
    score += 15;
  } else {
    feedback.push('Add a number');
  }

  if (VALIDATION.PASSWORD_REQUIREMENTS.SPECIAL_CHAR.test(password)) {
    score += 15;
  } else {
    feedback.push('Add a special character');
  }

  // Bonus points for longer passwords
  if (password.length >= 16) {
    score += 10;
  }
  if (password.length >= 20) {
    score += 5;
  }

  // Check for weak passwords (deduct points)
  const passwordLower = password.toLowerCase();
  const isWeak = VALIDATION.WEAK_PASSWORDS.some((weak) =>
    passwordLower.includes(weak.toLowerCase())
  );
  if (isWeak) {
    score = Math.max(0, score - 30);
    feedback.push('Avoid common passwords');
  }

  // Determine strength level
  let strength = 'weak';
  if (score >= 85) {
    strength = 'strong';
  } else if (score >= 60) {
    strength = 'medium';
  }

  return {
    strength,
    score,
    feedback: feedback.length > 0 ? feedback : ['Password looks good!'],
  };
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  if (!email) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validates OTP format
 * @param {string} otp - The OTP to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateOTP = (otp) => {
  if (!otp) {
    return { isValid: false, error: 'OTP is required' };
  }

  if (otp.length !== VALIDATION.OTP_LENGTH) {
    return { isValid: false, error: `OTP must be ${VALIDATION.OTP_LENGTH} digits` };
  }

  if (!/^\d+$/.test(otp)) {
    return { isValid: false, error: 'OTP must contain only numbers' };
  }

  return { isValid: true, error: null };
};

