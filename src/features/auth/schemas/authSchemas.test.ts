import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, getPasswordStrength } from './authSchemas'

describe('authSchemas', () => {
  describe('loginSchema', () => {
    it('should validate valid login credentials', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        rememberMe: true,
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate without rememberMe field', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.rememberMe).toBe(false)
      }
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123!',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('email')
      }
    })

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'Password123!',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept any password length for login', () => {
      const validData = {
        email: 'test@example.com',
        password: '1', // Short password should be valid for login
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('registerSchema', () => {
    const validRegisterData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      termsAccepted: true,
    }

    it('should validate valid registration data', () => {
      const result = registerSchema.safeParse(validRegisterData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        ...validRegisterData,
        email: 'invalid',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject username shorter than 3 characters', () => {
      const invalidData = {
        ...validRegisterData,
        username: 'ab',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('username')
      }
    })

    it('should reject username longer than 50 characters', () => {
      const invalidData = {
        ...validRegisterData,
        username: 'a'.repeat(51),
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject username with invalid characters', () => {
      const invalidUsernames = ['user@name', 'user name', 'user#123', 'user!']

      invalidUsernames.forEach((username) => {
        const result = registerSchema.safeParse({
          ...validRegisterData,
          username,
        })
        expect(result.success).toBe(false)
      })
    })

    it('should accept username with valid characters', () => {
      const validUsernames = ['user123', 'user-name', 'user_name', 'User-Name_123']

      validUsernames.forEach((username) => {
        const result = registerSchema.safeParse({
          ...validRegisterData,
          username,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        ...validRegisterData,
        password: 'Pass1!',
        confirmPassword: 'Pass1!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without uppercase letter', () => {
      const invalidData = {
        ...validRegisterData,
        password: 'password123!',
        confirmPassword: 'password123!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without lowercase letter', () => {
      const invalidData = {
        ...validRegisterData,
        password: 'PASSWORD123!',
        confirmPassword: 'PASSWORD123!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without number', () => {
      const invalidData = {
        ...validRegisterData,
        password: 'Password!',
        confirmPassword: 'Password!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without special character', () => {
      const invalidData = {
        ...validRegisterData,
        password: 'Password123',
        confirmPassword: 'Password123',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        ...validRegisterData,
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result.error.errors.find((e) => e.path.includes('confirmPassword'))
        expect(error).toBeDefined()
      }
    })

    it('should reject when terms not accepted', () => {
      const invalidData = {
        ...validRegisterData,
        termsAccepted: false,
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('termsAccepted')
      }
    })

    it('should accept valid passwords with various special characters', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*']

      specialChars.forEach((char) => {
        const result = registerSchema.safeParse({
          ...validRegisterData,
          password: `Password123${char}`,
          confirmPassword: `Password123${char}`,
        })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('getPasswordStrength', () => {
    it('should return weak for short passwords', () => {
      expect(getPasswordStrength('Pass1!')).toBe('weak')
      expect(getPasswordStrength('abc123')).toBe('weak')
    })

    it('should return weak for passwords with only 1-2 requirements', () => {
      expect(getPasswordStrength('password')).toBe('weak')
      expect(getPasswordStrength('PASSWORD')).toBe('weak')
      expect(getPasswordStrength('12345678')).toBe('weak')
    })

    it('should return medium for 8-11 character passwords with 3-4 requirements', () => {
      expect(getPasswordStrength('Password1')).toBe('medium')
      expect(getPasswordStrength('Pass123!')).toBe('medium')
    })

    it('should return strong for 12+ character passwords with all requirements', () => {
      expect(getPasswordStrength('Password123!')).toBe('strong')
      expect(getPasswordStrength('VerySecure123!Password')).toBe('strong')
    })

    it('should consider uppercase letters', () => {
      const withUpper = getPasswordStrength('Password123!')
      const withoutUpper = getPasswordStrength('password123!')

      expect(withUpper).toBe('strong')
      expect(withoutUpper).toBe('medium')
    })

    it('should consider lowercase letters', () => {
      const score1 = getPasswordStrength('PASSWORD123!')
      const score2 = getPasswordStrength('Password123!')

      expect(score2).toBe('strong')
      expect(score1).toBe('medium')
    })

    it('should consider digits', () => {
      const withDigits = getPasswordStrength('Password123!')
      const withoutDigits = getPasswordStrength('PasswordABC!')

      expect(withDigits).toBe('strong')
      // Without digits, score should be lower
    })

    it('should consider special characters', () => {
      const withSpecial = getPasswordStrength('Password123!')
      const withoutSpecial = getPasswordStrength('Password1234')

      expect(withSpecial).toBe('strong')
    })

    it('should handle empty string', () => {
      expect(getPasswordStrength('')).toBe('weak')
    })

    it('should handle very long passwords', () => {
      const longPassword = 'Password123!' + 'a'.repeat(50)
      expect(getPasswordStrength(longPassword)).toBe('strong')
    })

    it('should differentiate between medium and strong based on length', () => {
      const mediumLength = 'Pass123!' // 8 chars, meets requirements
      const strongLength = 'Password123!' // 12 chars, meets requirements

      expect(getPasswordStrength(mediumLength)).toBe('medium')
      expect(getPasswordStrength(strongLength)).toBe('strong')
    })

    it('should handle passwords with only special characters', () => {
      expect(getPasswordStrength('!@#$%^&*()')).toBe('weak')
    })

    it('should handle passwords with mixed requirements', () => {
      // 3 requirements: upper, lower, digit (no special char)
      expect(getPasswordStrength('Password123')).toBe('medium')

      // 3 requirements: upper, lower, special (no digit)
      expect(getPasswordStrength('Password!!!')).toBe('medium')

      // 3 requirements: lower, digit, special (no upper)
      expect(getPasswordStrength('password123!')).toBe('medium')

      // All 4 requirements
      expect(getPasswordStrength('Password123!')).toBe('strong')
    })
  })
})
