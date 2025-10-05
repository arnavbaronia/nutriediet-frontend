/**
 * Application Constants
 * Centralized configuration and constant values
 */

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Environment
export const IS_PRODUCTION = process.env.REACT_APP_ENV === 'production';
export const IS_DEVELOPMENT = process.env.REACT_APP_ENV === 'development';
export const IS_DEBUG = process.env.REACT_APP_DEBUG === 'true';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Client
  CLIENT_PROFILE: (clientId) => `/clients/${clientId}/my_profile`,
  CLIENT_DIET: (clientId) => `/clients/${clientId}/diet`,
  CLIENT_EXERCISE: (clientId) => `/clients/${clientId}/exercise`,
  CLIENT_RECIPE: (clientId) => `/clients/${clientId}/recipe`,
  CLIENT_MOTIVATION: (clientId) => `/clients/${clientId}/motivation`,
  CLIENT_WEIGHT: (clientId) => `/clients/${clientId}/weight_update`,
  
  // Admin
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_CLIENT_DETAILS: (clientId) => `/admin/clients/${clientId}`,
  ADMIN_DIET_TEMPLATES: '/admin/diet_templates',
  ADMIN_RECIPES: '/admin/recipes',
  ADMIN_EXERCISES: '/admin/exercises',
  ADMIN_MOTIVATIONS: '/admin/motivations',
};

// User Types
export const USER_TYPES = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN',
};

// Diet Types
export const DIET_TYPES = {
  REGULAR: '1',
  DETOX: '2',
  DETOX_WATER: '3',
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER_TYPE: 'user_type',
  CLIENT_ID: 'client_id',
  EMAIL: 'email',
  IS_ACTIVE: 'is_active',
  USER: 'user',
  USER_ID: 'userId',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  CLIENT_DASHBOARD: (clientId) => `/clients/${clientId}/diet`,
  ACCOUNT_ACTIVATION: '/account-activation',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
  DATA_SAVED: 'Data saved successfully!',
};

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 12,
  MAX_PASSWORD_LENGTH: 128,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  OTP_LENGTH: 6,
  PASSWORD_REQUIREMENTS: {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    NUMBER: /[0-9]/,
    SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'~`]/,
  },
  WEAK_PASSWORDS: [
    'password123!',
    'admin123456!',
    'welcome12345!',
    'qwerty123456!',
    '123456789abc!',
    'letmein12345!',
  ],
};

