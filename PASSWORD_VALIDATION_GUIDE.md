# Password Validation Implementation Guide

## Overview
This document describes the password validation implementation that matches the backend security requirements.

---

## Password Requirements

### Security Standards
Passwords must meet the following criteria:

1. **Minimum Length**: 12 characters
2. **Maximum Length**: 128 characters (prevents DoS attacks)
3. **Character Requirements**:
   - At least one uppercase letter (A-Z)
   - At least one lowercase letter (a-z)
   - At least one number (0-9)
   - At least one special character: `!@#$%^&*(),.?":{}|<>_-+=[]\/;'~\``
4. **Common Password Check**: Rejects common weak passwords

---

## Implementation Files

### 1. Constants (`src/utils/constants.js`)
```javascript
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 12,
  MAX_PASSWORD_LENGTH: 128,
  PASSWORD_REQUIREMENTS: {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    NUMBER: /[0-9]/,
    SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'~`]/,
  },
  WEAK_PASSWORDS: [
    'password123!',
    'admin123456!',
    // ... more weak passwords
  ],
};
```

### 2. Validator Functions (`src/utils/passwordValidator.js`)

#### `validatePasswordStrength(password)`
Validates password against all requirements.

**Returns:**
```javascript
{
  isValid: boolean,
  errors: string[]  // Array of error messages
}
```

**Example Usage:**
```javascript
import { validatePasswordStrength } from '../utils/passwordValidator';

const result = validatePasswordStrength('MyP@ssw0rd123');
if (!result.isValid) {
  console.log(result.errors); // Array of validation errors
}
```

#### `getPasswordStrength(password)`
Calculates password strength for visual indicators.

**Returns:**
```javascript
{
  strength: 'none' | 'weak' | 'medium' | 'strong',
  score: number,        // 0-100
  feedback: string[]    // Suggestions for improvement
}
```

**Example Usage:**
```javascript
import { getPasswordStrength } from '../utils/passwordValidator';

const result = getPasswordStrength('MyP@ss');
console.log(result.strength); // 'weak'
console.log(result.score);    // 45
console.log(result.feedback); // ['Add 6 more characters', 'Add a number']
```

#### Other Helper Functions

**`validateEmail(email)`**
```javascript
// Returns: boolean
validateEmail('user@example.com'); // true
```

**`validateOTP(otp)`**
```javascript
// Returns: { isValid: boolean, error: string }
validateOTP('123456'); // { isValid: true, error: null }
validateOTP('12345');  // { isValid: false, error: 'OTP must be 6 digits' }
```

---

## PasswordInput Component

### Purpose
A reusable password input component with:
- Password visibility toggle
- Real-time strength meter
- Requirements checklist
- Validation feedback

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | `''` | Current password value |
| `onChange` | function | required | Change handler |
| `name` | string | `'password'` | Input name attribute |
| `placeholder` | string | `'Password'` | Input placeholder |
| `showRequirements` | boolean | `true` | Show requirements checklist |
| `showStrengthMeter` | boolean | `true` | Show strength meter |
| `required` | boolean | `true` | Mark field as required |
| `className` | string | `''` | Additional CSS classes |

### Usage Example

```jsx
import PasswordInput from './components/PasswordInput';

function MyForm() {
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <form>
      <PasswordInput
        value={password}
        onChange={handleChange}
        name="password"
        placeholder="Enter your password"
        showRequirements={true}
        showStrengthMeter={true}
      />
    </form>
  );
}
```

### Visual Features

#### Strength Meter
- **Strong** (85-100%): Green
- **Medium** (60-84%): Orange
- **Weak** (0-59%): Red

#### Requirements Checklist
Shows real-time validation of:
- ✅ At least 12 characters
- ✅ One uppercase letter
- ✅ One lowercase letter
- ✅ One number
- ✅ One special character

---

## Integration in Components

### Signup Component
```jsx
import PasswordInput from './PasswordInput';
import { validatePasswordStrength, validateEmail } from '../utils/passwordValidator';

const handleSignup = async (e) => {
  e.preventDefault();
  
  // Validate email
  if (!validateEmail(formData.email)) {
    setError("Please enter a valid email address");
    return;
  }

  // Validate password
  const passwordValidation = validatePasswordStrength(formData.password);
  if (!passwordValidation.isValid) {
    setError(passwordValidation.errors[0]);
    return;
  }

  // Proceed with signup...
};
```

### Login Component (Password Reset)
```jsx
import { validatePasswordStrength, validateOTP } from '../utils/passwordValidator';

const handlePasswordReset = async (e) => {
  e.preventDefault();
  
  // Validate OTP
  const otpValidation = validateOTP(otp);
  if (!otpValidation.isValid) {
    setError(otpValidation.error);
    return;
  }

  // Validate new password
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    setError(passwordValidation.errors.join('. '));
    return;
  }

  // Proceed with password reset...
};
```

---

## Backend Sync

### Matching Backend Requirements
The frontend validation mirrors the backend implementation in:
`nutriediet-go/helpers/password_validator.go`

**Backend function:** `ValidatePasswordStrength(password string) error`

### Requirements Alignment

| Requirement | Backend | Frontend |
|-------------|---------|----------|
| Min Length | 12 chars | 12 chars ✅ |
| Max Length | 128 chars | 128 chars ✅ |
| Uppercase | Required | Required ✅ |
| Lowercase | Required | Required ✅ |
| Number | Required | Required ✅ |
| Special Char | Required | Required ✅ |
| Weak Password Check | Yes | Yes ✅ |

---

## User Experience Flow

### 1. During Signup
```
User types password → Real-time validation
                    → Strength meter updates
                    → Requirements checklist updates
                    → Visual feedback (colors, icons)
                    
User submits form   → Client-side validation
                    → If invalid: Show error
                    → If valid: Submit to backend
                    → Backend validates again
```

### 2. During Password Reset
```
User receives OTP → Enters OTP (digits only, 6 chars)
                  → Enters new password
                  → Real-time validation
                  
User submits      → Validate OTP format
                  → Validate password strength
                  → If invalid: Show specific error
                  → If valid: Submit to backend
```

---

## Testing Checklist

### Valid Passwords ✅
- `MyP@ssw0rd123` (12 chars, all requirements)
- `Str0ng!Password` (15 chars, all requirements)
- `C0mpl3x&Secure!Pass` (20 chars, very strong)

### Invalid Passwords ❌
- `short!1A` (too short, < 12 chars)
- `nouppercase123!` (no uppercase)
- `NOLOWERCASE123!` (no lowercase)
- `NoNumbers!@#` (no numbers)
- `NoSpecial123` (no special character)
- `password123!` (common weak password)

---

## Error Messages

### User-Friendly Messages
- "Password must be at least 12 characters long"
- "Password must contain at least one uppercase letter"
- "Password must contain at least one lowercase letter"
- "Password must contain at least one number"
- "Password must contain at least one special character"
- "Password is too common, please choose a stronger password"

---

## Styling

### CSS Files
- `src/styles/PasswordInput.css` - Password input component styles

### Color Scheme
- **Strong**: `#4caf50` (Green)
- **Medium**: `#ff9800` (Orange)
- **Weak**: `#f44336` (Red)
- **Valid**: `#4caf50` (Green checkmark)
- **Invalid**: `#f44336` (Red X)

---

## Accessibility

### ARIA Labels
- Password visibility toggle has proper aria-label
- Input field has descriptive labels
- Error messages are associated with input

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order is logical
- Enter submits form

---

## Security Considerations

### Why These Requirements?

1. **12 Character Minimum**
   - Increases brute force attack difficulty exponentially
   - NIST recommends minimum 8-12 characters

2. **Character Variety**
   - Increases password entropy
   - Prevents simple dictionary attacks

3. **Maximum Length (128)**
   - Prevents DoS attacks with extremely long passwords
   - Reasonable upper limit for usability

4. **Weak Password Blacklist**
   - Prevents use of commonly breached passwords
   - Protects users from themselves

### Client-Side Validation Benefits
- ✅ Immediate feedback to users
- ✅ Reduces server load
- ✅ Better UX with real-time guidance
- ⚠️ **Not a replacement for server-side validation**

### Security Notes
- Frontend validation is for UX only
- Backend MUST validate again (it does!)
- Never trust client-side data alone

---

## Future Enhancements

### Possible Improvements
1. Check against HaveIBeenPwned API for breached passwords
2. Add password strength history (prevent reuse)
3. Add "Show password requirements" tooltip
4. Add password generator feature
5. Add entropy calculation display

---

## Common Issues & Solutions

### Issue: Password accepted in frontend but rejected by backend
**Solution**: Ensure frontend and backend validation logic match exactly. Check special character regex patterns.

### Issue: Strength meter not updating
**Solution**: Verify `useEffect` dependency array includes `value` prop.

### Issue: Requirements checklist not showing
**Solution**: Ensure `showRequirements={true}` and password `value` exists.

---

## Support

For questions or issues:
1. Check backend validator: `nutriediet-go/helpers/password_validator.go`
2. Review frontend validator: `src/utils/passwordValidator.js`
3. Test with provided valid/invalid examples

---

**Last Updated**: October 5, 2025  
**Version**: 1.0  
**Matches Backend Version**: nutriediet-go password_validator.go

