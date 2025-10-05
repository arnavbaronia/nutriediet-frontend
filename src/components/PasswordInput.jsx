import React, { useState, useEffect } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import '../styles/PasswordInput.css';
import { validatePasswordStrength, getPasswordStrength } from '../utils/passwordValidator';

/**
 * PasswordInput Component with validation and strength indicator
 * 
 * @param {string} value - Current password value
 * @param {function} onChange - Callback when password changes
 * @param {string} name - Input name attribute
 * @param {string} placeholder - Input placeholder
 * @param {boolean} showRequirements - Show password requirements list
 * @param {boolean} showStrengthMeter - Show password strength meter
 * @param {boolean} required - Whether field is required
 */
const PasswordInput = ({
  value = '',
  onChange,
  name = 'password',
  placeholder = 'Password',
  showRequirements = true,
  showStrengthMeter = true,
  required = true,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({ isValid: false, errors: [] });
  const [strength, setStrength] = useState({ strength: 'none', score: 0, feedback: [] });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (value) {
      const validationResult = validatePasswordStrength(value);
      const strengthResult = getPasswordStrength(value);
      setValidation(validationResult);
      setStrength(strengthResult);
    } else {
      setValidation({ isValid: false, errors: [] });
      setStrength({ strength: 'none', score: 0, feedback: [] });
    }
  }, [value]);

  const handleBlur = () => {
    setTouched(true);
  };

  const getStrengthColor = () => {
    switch (strength.strength) {
      case 'strong':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'weak':
        return '#f44336';
      default:
        return '#e0e0e0';
    }
  };

  const getStrengthLabel = () => {
    switch (strength.strength) {
      case 'strong':
        return 'Strong';
      case 'medium':
        return 'Medium';
      case 'weak':
        return 'Weak';
      default:
        return '';
    }
  };

  return (
    <div className={`password-input-container ${className}`}>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          className="password-input-field"
          required={required}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
        </button>
      </div>

      {/* Password Strength Meter */}
      {showStrengthMeter && value && (
        <div className="password-strength-container">
          <div className="password-strength-bar">
            <div
              className="password-strength-fill"
              style={{
                width: `${strength.score}%`,
                backgroundColor: getStrengthColor(),
              }}
            />
          </div>
          <div className="password-strength-label" style={{ color: getStrengthColor() }}>
            {getStrengthLabel()}
          </div>
        </div>
      )}

      {/* Password Requirements Checklist */}
      {showRequirements && value && touched && (
        <div className="password-requirements">
          <div className="requirement-title">Password Requirements:</div>
          <ul className="requirements-list">
            <li className={value.length >= 12 ? 'valid' : 'invalid'}>
              {value.length >= 12 ? <CheckCircleIcon /> : <CancelIcon />}
              <span>At least 12 characters</span>
            </li>
            <li className={/[A-Z]/.test(value) ? 'valid' : 'invalid'}>
              {/[A-Z]/.test(value) ? <CheckCircleIcon /> : <CancelIcon />}
              <span>One uppercase letter</span>
            </li>
            <li className={/[a-z]/.test(value) ? 'valid' : 'invalid'}>
              {/[a-z]/.test(value) ? <CheckCircleIcon /> : <CancelIcon />}
              <span>One lowercase letter</span>
            </li>
            <li className={/[0-9]/.test(value) ? 'valid' : 'invalid'}>
              {/[0-9]/.test(value) ? <CheckCircleIcon /> : <CancelIcon />}
              <span>One number</span>
            </li>
            <li className={/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'~`]/.test(value) ? 'valid' : 'invalid'}>
              {/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'~`]/.test(value) ? <CheckCircleIcon /> : <CancelIcon />}
              <span>One special character</span>
            </li>
          </ul>
        </div>
      )}

      {/* Error Messages (shown on submit or after blur) */}
      {touched && !validation.isValid && validation.errors.length > 0 && (
        <div className="password-errors">
          {validation.errors.map((error, index) => (
            <div key={index} className="password-error">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;

