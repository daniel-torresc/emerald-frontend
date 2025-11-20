import axios from 'axios'
import { useAuthStore } from '@/features/auth/stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState()
    if (tokens?.access_token) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Token refresh queue to prevent race conditions
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Response interceptor - Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const { tokens, setTokens, logout } = useAuthStore.getState()

    // If no refresh token, logout
    if (!tokens?.refresh_token) {
      processQueue(new Error('No refresh token'))
      isRefreshing = false
      logout()
      return Promise.reject(error)
    }

    try {
      // Attempt to refresh the token
      const { data } = await axios.post(`${api.defaults.baseURL}/api/auth/refresh`, {
        refresh_token: tokens.refresh_token,
      })

      // Update tokens in store
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      })

      // Update the original request with new token
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`

      processQueue()
      isRefreshing = false

      // Retry the original request
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError as Error)
      isRefreshing = false
      logout()

      // Redirect to login
      window.location.href = '/login'

      return Promise.reject(refreshError)
    }
  }
)

export default api
