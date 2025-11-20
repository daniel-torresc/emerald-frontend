// Re-export User type from auth store
export type { User } from '../stores/authStore'

// Auth API request types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  username: string
  password: string
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
}

// Auth API response types
export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface UserResponse {
  id: string
  email: string
  username: string
  full_name: string | null
  is_active: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
  last_login_at: string | null
}

// API Error type
export interface APIError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>
}
