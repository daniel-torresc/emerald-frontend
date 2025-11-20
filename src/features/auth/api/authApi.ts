import api from '@/shared/lib/axios'
import type {
  LoginCredentials,
  RegisterCredentials,
  TokenResponse,
  UserResponse,
} from '../types'

export const authApi = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const { data } = await api.post<TokenResponse>('/api/auth/login', credentials)
    return data
  },

  // Register a new user
  register: async (credentials: RegisterCredentials): Promise<UserResponse> => {
    const { data } = await api.post<UserResponse>('/api/auth/register', credentials)
    return data
  },

  // Logout (revoke refresh token)
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/api/auth/logout', { refresh_token: refreshToken })
  },

  // Get current user profile
  getCurrentUser: async (): Promise<UserResponse> => {
    const { data } = await api.get<UserResponse>('/api/v1/users/me')
    return data
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const { data } = await api.post<TokenResponse>('/api/auth/refresh', {
      refresh_token: refreshToken,
    })
    return data
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/api/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
  },
}
