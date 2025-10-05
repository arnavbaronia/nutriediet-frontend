/**
 * Logger Utility
 * Provides consistent logging across the application
 * Only logs in development mode
 */

import { IS_DEVELOPMENT, IS_DEBUG } from './constants';

/**
 * Log levels
 */
const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

/**
 * Logger class with environment-aware logging
 */
class Logger {
  /**
   * Log error messages (always logged, even in production)
   * @param {string} message - Error message
   * @param {Error|Object} error - Error object or additional data
   */
  error(message, error = null) {
    console.error(`[ERROR] ${message}`, error || '');
    
    // In production, you might want to send to error tracking service
    // if (!IS_DEVELOPMENT) {
    //   this.sendToErrorTracking(message, error);
    // }
  }

  /**
   * Log warning messages (only in development)
   * @param {string} message - Warning message
   * @param {*} data - Additional data
   */
  warn(message, data = null) {
    if (IS_DEVELOPMENT) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  /**
   * Log info messages (only in development)
   * @param {string} message - Info message
   * @param {*} data - Additional data
   */
  info(message, data = null) {
    if (IS_DEVELOPMENT) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  /**
   * Log debug messages (only in development with debug flag)
   * @param {string} message - Debug message
   * @param {*} data - Additional data
   */
  debug(message, data = null) {
    if (IS_DEVELOPMENT && IS_DEBUG) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }

  /**
   * Log API requests (only in debug mode)
   * @param {string} method - HTTP method
   * @param {string} url - API endpoint
   * @param {*} data - Request data
   */
  apiRequest(method, url, data = null) {
    if (IS_DEBUG) {
      console.log(`[API REQUEST] ${method} ${url}`, data || '');
    }
  }

  /**
   * Log API responses (only in debug mode)
   * @param {string} method - HTTP method
   * @param {string} url - API endpoint
   * @param {*} response - Response data
   */
  apiResponse(method, url, response = null) {
    if (IS_DEBUG) {
      console.log(`[API RESPONSE] ${method} ${url}`, response || '');
    }
  }

  /**
   * Log API errors (always logged)
   * @param {string} method - HTTP method
   * @param {string} url - API endpoint
   * @param {Error} error - Error object
   */
  apiError(method, url, error) {
    console.error(`[API ERROR] ${method} ${url}`, error);
  }

  /**
   * Send errors to tracking service (placeholder for future implementation)
   * @param {string} message - Error message
   * @param {Error|Object} error - Error object
   */
  sendToErrorTracking(message, error) {
    // TODO: Implement error tracking service integration
    // Examples: Sentry, LogRocket, Bugsnag, etc.
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;

// Also export for convenience
export { LogLevel };

