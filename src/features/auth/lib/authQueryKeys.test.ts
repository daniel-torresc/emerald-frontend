import { describe, it, expect } from 'vitest'
import { authQueryKeys } from './authQueryKeys'

describe('authQueryKeys', () => {
  describe('all', () => {
    it('should return base auth key', () => {
      expect(authQueryKeys.all).toEqual(['auth'])
    })

    it('should be a const array for type inference', () => {
      const keys = authQueryKeys.all
      // TypeScript should infer this as readonly ["auth"]
      expect(keys).toHaveLength(1)
      expect(keys[0]).toBe('auth')
    })
  })

  describe('currentUser', () => {
    it('should return current user query key', () => {
      const key = authQueryKeys.currentUser()
      expect(key).toEqual(['auth', 'currentUser'])
    })

    it('should include base auth key', () => {
      const key = authQueryKeys.currentUser()
      expect(key[0]).toBe(authQueryKeys.all[0])
    })

    it('should be callable multiple times with same result', () => {
      const key1 = authQueryKeys.currentUser()
      const key2 = authQueryKeys.currentUser()
      expect(key1).toEqual(key2)
    })
  })

  describe('checkUsername', () => {
    it('should have base definition key', () => {
      expect(authQueryKeys.checkUsername._def).toEqual(['auth', 'checkUsername'])
    })

    it('should generate detail key with username', () => {
      const key = authQueryKeys.checkUsername.detail('johndoe')
      expect(key).toEqual(['auth', 'checkUsername', 'johndoe'])
    })

    it('should generate different keys for different usernames', () => {
      const key1 = authQueryKeys.checkUsername.detail('user1')
      const key2 = authQueryKeys.checkUsername.detail('user2')

      expect(key1).not.toEqual(key2)
      expect(key1).toEqual(['auth', 'checkUsername', 'user1'])
      expect(key2).toEqual(['auth', 'checkUsername', 'user2'])
    })

    it('should handle special characters in username', () => {
      const key = authQueryKeys.checkUsername.detail('user-name_123')
      expect(key).toEqual(['auth', 'checkUsername', 'user-name_123'])
    })

    it('should handle empty string username', () => {
      const key = authQueryKeys.checkUsername.detail('')
      expect(key).toEqual(['auth', 'checkUsername', ''])
    })

    it('should include base auth key', () => {
      const key = authQueryKeys.checkUsername.detail('test')
      expect(key[0]).toBe(authQueryKeys.all[0])
    })
  })

  describe('session', () => {
    it('should have base definition key', () => {
      expect(authQueryKeys.session._def).toEqual(['auth', 'session'])
    })

    it('should generate validate key', () => {
      const key = authQueryKeys.session.validate()
      expect(key).toEqual(['auth', 'session', 'validate'])
    })

    it('should be callable multiple times with same result', () => {
      const key1 = authQueryKeys.session.validate()
      const key2 = authQueryKeys.session.validate()
      expect(key1).toEqual(key2)
    })

    it('should include base auth key', () => {
      const key = authQueryKeys.session.validate()
      expect(key[0]).toBe(authQueryKeys.all[0])
    })
  })

  describe('key hierarchy', () => {
    it('should maintain proper nesting for all keys', () => {
      const allKeys = [
        authQueryKeys.all,
        authQueryKeys.currentUser(),
        authQueryKeys.checkUsername._def,
        authQueryKeys.checkUsername.detail('test'),
        authQueryKeys.session._def,
        authQueryKeys.session.validate(),
      ]

      // All keys should start with 'auth'
      allKeys.forEach((key) => {
        expect(key[0]).toBe('auth')
      })
    })

    it('should allow invalidation at different levels', () => {
      // Simulate query key matching (how React Query would match keys)
      const matchesPrefix = (key: readonly any[], prefix: readonly any[]) => {
        return prefix.every((value, index) => key[index] === value)
      }

      const testKeys = [
        authQueryKeys.currentUser(),
        authQueryKeys.checkUsername.detail('user1'),
        authQueryKeys.checkUsername.detail('user2'),
        authQueryKeys.session.validate(),
      ]

      // Invalidating 'all' should match all keys
      testKeys.forEach((key) => {
        expect(matchesPrefix(key, authQueryKeys.all)).toBe(true)
      })

      // Invalidating checkUsername._def should match both username checks
      expect(
        matchesPrefix(authQueryKeys.checkUsername.detail('user1'), authQueryKeys.checkUsername._def)
      ).toBe(true)
      expect(
        matchesPrefix(authQueryKeys.checkUsername.detail('user2'), authQueryKeys.checkUsername._def)
      ).toBe(true)

      // But not other queries
      expect(matchesPrefix(authQueryKeys.currentUser(), authQueryKeys.checkUsername._def)).toBe(
        false
      )
    })
  })

  describe('type safety', () => {
    it('should maintain const assertion for type inference', () => {
      // These tests verify that TypeScript infers the correct types
      // Runtime checks to ensure const assertion is working

      const baseKey = authQueryKeys.all
      expect(Object.isFrozen(baseKey)).toBe(false) // 'as const' doesn't freeze, but ensures type inference

      const currentUserKey = authQueryKeys.currentUser()
      expect(Array.isArray(currentUserKey)).toBe(true)
      expect(currentUserKey).toHaveLength(2)

      const usernameKey = authQueryKeys.checkUsername.detail('test')
      expect(Array.isArray(usernameKey)).toBe(true)
      expect(usernameKey).toHaveLength(3)
    })
  })

  describe('cache invalidation scenarios', () => {
    it('should support invalidating all auth queries', () => {
      const baseKey = authQueryKeys.all
      expect(baseKey).toEqual(['auth'])
    })

    it('should support invalidating specific username checks', () => {
      const specificKey = authQueryKeys.checkUsername.detail('johndoe')
      expect(specificKey).toEqual(['auth', 'checkUsername', 'johndoe'])
    })

    it('should support invalidating all username checks', () => {
      const baseKey = authQueryKeys.checkUsername._def
      expect(baseKey).toEqual(['auth', 'checkUsername'])
    })

    it('should support invalidating session queries', () => {
      const sessionKey = authQueryKeys.session._def
      expect(sessionKey).toEqual(['auth', 'session'])
    })
  })

  describe('key uniqueness', () => {
    it('should generate unique keys for different query types', () => {
      const keys = [
        authQueryKeys.currentUser(),
        authQueryKeys.checkUsername._def,
        authQueryKeys.session._def,
      ]

      // Convert to strings for easy comparison
      const keyStrings = keys.map((k) => JSON.stringify(k))

      // All should be unique
      const uniqueKeys = new Set(keyStrings)
      expect(uniqueKeys.size).toBe(keys.length)
    })

    it('should generate same key for same parameters', () => {
      const key1 = authQueryKeys.checkUsername.detail('test')
      const key2 = authQueryKeys.checkUsername.detail('test')

      expect(JSON.stringify(key1)).toBe(JSON.stringify(key2))
    })
  })
})
