# Phase 1: Foundation & Authentication - Implementation Plan

**Plan Date:** November 19, 2025
**Project:** Emerald Personal Finance Platform
**Phase:** Phase 1 - Foundation & Authentication
**Status:** 🔵 Planning Complete
**Priority:** P0 - Critical
**Estimated Effort:** 2-3 weeks (1 developer)

---

## Executive Summary

This implementation plan details the complete build-out of Phase 1 for the Emerald Personal Finance Platform frontend. Phase 1 establishes the foundational architecture, authentication system, design system, and application shell that all subsequent phases will build upon.

### Primary Objectives

1. **Project Foundation**: Set up modern React 18 + TypeScript 5.7 + Vite 6 development environment with pnpm 9
2. **Design System**: Implement unique dark-mode-first aesthetic with Radix UI + Tailwind CSS v4
3. **Authentication**: Build secure JWT-based authentication with login, registration, and protected routes
4. **Application Shell**: Create responsive navigation and layout system
5. **State Management**: Configure TanStack Query + Zustand architecture
6. **Testing Infrastructure**: Set up Vitest, React Testing Library, and Playwright

### Expected Outcomes

- **Functional**: Users can register, login, logout with session persistence across refreshes
- **Visual**: Complete dark-mode design system with unique, non-corporate aesthetic
- **Technical**: Production-ready foundation with >80% test coverage
- **Security**: XSS/CSRF protected authentication flow with HTTP-only cookies
- **Performance**: <150KB initial bundle, <2.5s Time to Interactive

### Success Criteria

Phase 1 is complete when all Definition of Done criteria are met (see Section 8).

---

## 1. Technical Architecture

### 1.1 System Design Overview

```
┌─────────────────────────────────────────────────────────┐
│  Browser (Modern: Chrome 90+, Safari 15+, Firefox 88+) │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  React 18 SPA (Client-Side Rendered)                   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Presentation Layer                                 │ │
│  │  - Radix UI primitives + Tailwind CSS v4          │ │
│  │  - TanStack Router (file-based, type-safe)        │ │
│  │  - Responsive layouts (mobile-first)              │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↓                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │  State Management Layer                            │ │
│  │  - TanStack Query (server state, caching)         │ │
│  │  - Zustand (client UI state)                      │ │
│  │  - React Hook Form (form state)                   │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↓                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │  API Communication Layer                           │ │
│  │  - Axios with interceptors                        │ │
│  │  - JWT refresh token rotation                     │ │
│  │  - Automatic 401 handling                         │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTPS
┌─────────────────────────────────────────────────────────┐
│  Backend API (emerald-backend)                         │
│  - RESTful JSON API                                    │
│  - JWT authentication                                   │
│  - PostgreSQL database                                  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Key Components & Responsibilities

| Component | Responsibility | Technology |
|-----------|----------------|------------|
| **Router** | URL management, navigation, route protection | TanStack Router v1 |
| **Auth Manager** | Login, registration, token refresh, logout | TanStack Query + Zustand |
| **API Client** | HTTP requests, interceptors, error handling | Axios |
| **Design System** | UI components, theming, dark mode | Radix UI + Tailwind v4 |
| **Form Manager** | Validation, submission, error display | React Hook Form + Zod |
| **State Stores** | UI state (theme, sidebar, modals) | Zustand |
| **Query Cache** | Server data caching, invalidation | TanStack Query |

### 1.3 Integration Points

1. **Backend API**: All endpoints prefixed with `/api/`
   - Authentication: `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/auth/logout`
   - User data: `/api/users/me`

2. **Browser Storage**:
   - **Cookies**: JWT access/refresh tokens (HTTP-only, SameSite=Strict)
   - **LocalStorage**: User preferences (theme, sidebar state) - non-sensitive only
   - **SessionStorage**: Temporary UI state (redirect after login)

3. **External Services**: None (Phase 1 is fully self-contained)

### 1.4 Data Flow

**Authentication Flow:**
```
User submits login →
  React Hook Form validates →
    TanStack Query mutation →
      Axios POST /api/auth/login →
        Backend sets HTTP-only cookies →
          TanStack Query updates cache →
            Zustand updates auth state →
              Router redirects to dashboard
```

**Protected Route Access:**
```
User navigates to /accounts →
  TanStack Router beforeLoad hook →
    Check Zustand auth state →
      If unauthenticated: redirect to /login →
        If authenticated: allow navigation →
          TanStack Query fetches user data →
            Render protected component
```

---

## 2. Technology Decisions

### 2.1 Package Manager: pnpm 9+

**Purpose**: Manages project dependencies with performance and security improvements over npm/yarn

**Why this choice**:
- **50% faster** installs than npm (14s vs 28s on average projects)
- **50% less disk space** through global content-addressable storage with hard links
- **Stricter dependency resolution** prevents phantom dependencies that npm/yarn allow
- **Monorepo ready** with built-in workspace support for future scalability
- **Industry standard 2025** - becoming default for modern React projects

**Version**: pnpm 9.15.0 or later

**Alternatives considered**:
- **npm**: Standard but slower, more disk usage, weaker dependency isolation
- **yarn**: Similar performance to npm, less adoption momentum than pnpm in 2025

**Installation & Setup**:
```bash
# Install pnpm globally
npm install -g pnpm@latest
# or
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Verify installation
pnpm --version  # Should be 9.x
```

---

### 2.2 Framework: React 18.3+

**Purpose**: UI component framework for building interactive user interfaces

**Why this choice**:
- **Market leadership**: 40% market share, largest ecosystem and talent pool
- **Concurrent rendering**: React 18's concurrent features improve responsiveness for data-heavy operations
- **Type safety**: Excellent TypeScript integration critical for financial data integrity
- **Proven in finance**: Major financial institutions report 30% reduction in bugs with React + TypeScript
- **Component ecosystem**: Richest selection of headless UI components for custom styling

**Version**: React 18.3.1, React DOM 18.3.1

**Alternatives considered**:
- **Angular**: Strong in enterprise but heavier bundles, steeper learning curve
- **Vue 3**: Gentler learning curve, smaller ecosystem, harder to find developers
- **Svelte**: Best performance but smallest ecosystem, hiring challenges

---

### 2.3 Language: TypeScript 5.7+

**Purpose**: Static type checking for JavaScript, preventing runtime errors in financial calculations

**Why this choice**:
- **Financial data integrity**: Prevents calculation errors, currency mixing, null/undefined bugs
- **Developer experience**: IDE autocomplete, refactoring safety, self-documenting code
- **Strict mode**: Catches edge cases at compile time vs production
- **Type inference**: Zod schemas automatically infer TypeScript types

**Version**: TypeScript 5.7.2 with strict mode enabled

**Configuration**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Alternatives considered**:
- **JavaScript**: Faster initial development but higher bug rate in production
- **Flow**: Less ecosystem support, declining adoption

---

### 2.4 Build Tool: Vite 6+

**Purpose**: Development server and production bundler

**Why this choice**:
- **Development speed**: esbuild (Go-based) provides ~10x faster cold starts than Webpack (~200ms vs ~1200ms)
- **Hot Module Replacement**: <100ms updates vs Webpack's 200-500ms
- **Built-in optimizations**: Automatic code splitting, tree shaking, chunk optimization
- **Modern defaults**: Native ES modules, no legacy browser baggage
- **pnpm integration**: First-class support for pnpm workspaces

**Version**: Vite 6.0.5 with @vitejs/plugin-react-swc

**Configuration**:
```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['@tanstack/react-router'],
          'query': ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
})
```

**Alternatives considered**:
- **Webpack**: Industry standard but significantly slower development experience
- **Parcel**: Good zero-config experience but less control over optimization

---

### 2.5 State Management: TanStack Query v5 + Zustand v5

**Purpose**: Separate server state (API data) from client state (UI preferences)

**Why this choice**:
- **Separation of concerns**: TanStack Query handles server caching/sync, Zustand handles UI state
- **40% smaller bundle** than Redux + middleware (~15KB vs ~25KB)
- **Built-in features**: Automatic caching, deduplication, background refetching, retry logic
- **Developer experience**: 90% of Redux power with 10% of the code

**TanStack Query Use Cases**:
- Fetching user data, accounts, transactions, categories
- Login/register/logout mutations
- Automatic cache invalidation after mutations
- Optimistic updates for better UX

**Zustand Use Cases**:
- Dark mode toggle
- Sidebar collapsed state
- Modal/drawer open states
- Active filter selections

**Version**:
- @tanstack/react-query 5.62.7
- zustand 5.0.2

**Configuration**:
```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

**Alternatives considered**:
- **Redux Toolkit**: Still solid but 40% more boilerplate, steeper learning curve
- **Jotai**: Atomic state, good for complex shared state but more complex than needed

---

### 2.6 Routing: TanStack Router v1

**Purpose**: Type-safe navigation with URL state management

**Why this choice**:
- **100% type-safe**: TypeScript errors for mistyped routes, params, or search params
- **Search params first-class**: Critical for financial apps with complex filters
- **File-based routing**: Auto-generates type-safe routes from file structure
- **Built-in data loading**: Integrated with TanStack Query for preloading
- **Code splitting**: Automatic per-route with lazy loading

**Version**: @tanstack/react-router 1.91.3

**Route Structure**:
```
src/routes/
  __root.tsx                    # Root layout with auth check
  index.tsx                     # Dashboard (protected)
  login.tsx                     # Login page (public)
  register.tsx                  # Registration page (public)
  _protected/                   # Protected layout
    accounts/
      index.tsx                 # Account list
      $accountId/
        index.tsx               # Account detail
```

**Alternatives considered**:
- **React Router v7**: Industry standard but lacks type safety for params/search
- **Next.js App Router**: Requires server-side rendering, overkill for self-hosted SPA

---

### 2.7 UI Components: Radix UI + Tailwind CSS v4

**Purpose**: Headless accessible primitives with utility-first styling

**Why this choice**:
- **Headless architecture**: Full styling control for unique aesthetic requirements
- **Accessibility built-in**: WCAG 2.2 compliant, keyboard navigation, ARIA labels
- **Production proven**: Used by Vercel, Supabase, CodeSandbox (15K+ stars, 8M weekly downloads)
- **Tailwind v4**: CSS variables perfect for dark mode, minimal bundle with JIT

**Radix Components**:
- Dialog (modals)
- DropdownMenu (user menu, context menus)
- Tooltip (help text)
- Label (form labels)
- Checkbox, RadioGroup (form inputs)

**Tailwind v4 Dark Mode**:
```css
/* src/shared/styles/theme.css */
@theme {
  /* Backgrounds */
  --color-background: #0a0a0a;
  --color-surface: #141414;
  --color-surface-elevated: #1a1a1a;

  /* Text */
  --color-text-primary: #e8e8e8;
  --color-text-secondary: #a0a0a0;
  --color-text-tertiary: #666666;

  /* Accent (passion) */
  --color-accent: #ff3366;
  --color-accent-hover: #ff4477;
  --color-accent-subtle: rgba(255, 51, 102, 0.1);

  /* Semantic */
  --color-success: #00e676;
  --color-error: #ff3366;
  --color-warning: #ffab00;
}
```

**Version**:
- @radix-ui/react-dialog 1.1.4
- @radix-ui/react-dropdown-menu 2.1.4
- @radix-ui/react-label 2.1.1
- tailwindcss 4.0.0

**Alternatives considered**:
- **Chakra UI**: Good dark mode but too opinionated for unique aesthetic
- **shadcn/ui**: Excellent but still relies on card-based patterns we want to avoid
- **Mantine**: 120+ components but harder to achieve non-standard designs

---

### 2.8 Forms: React Hook Form v7 + Zod v3

**Purpose**: Performant form handling with schema validation

**Why this choice**:
- **Performance**: Uncontrolled inputs minimize re-renders (critical for complex forms)
- **Type safety**: Zod schemas automatically infer TypeScript types
- **Validation**: Declarative schema validation vs imperative logic
- **Developer experience**: Less boilerplate than Formik or manual validation

**Example Schema**:
```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>
```

**Version**:
- react-hook-form 7.54.1
- @hookform/resolvers 3.9.1
- zod 3.24.1

**Alternatives considered**:
- **Formik**: More boilerplate, performance issues with large forms
- **Manual validation**: Error-prone, harder to maintain, no type inference

---

### 2.9 HTTP Client: Axios

**Purpose**: Promise-based HTTP client with interceptors

**Why this choice**:
- **Interceptors**: Critical for JWT refresh token rotation
- **Request/response transformation**: Automatic JSON handling, error normalization
- **Browser compatibility**: Handles older browsers gracefully
- **Typed responses**: Easy TypeScript integration

**Configuration**:
```typescript
// lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (can add auth headers if needed)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor (handles 401, token refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // JWT refresh logic (see Section 3.3)
    return Promise.reject(error)
  }
)

export default api
```

**Version**: axios 1.7.9

**Alternatives considered**:
- **fetch**: Native but requires more boilerplate for interceptors, error handling
- **ky**: Lightweight but less ecosystem support, harder to find examples

---

### 2.10 Testing Stack

**Purpose**: Ensure code quality, prevent regressions, validate business logic

**Unit Testing: Vitest**
- **Why**: Faster than Jest (native ES modules), same API, Vite integration
- **Version**: vitest 2.1.8

**Integration Testing: React Testing Library + Vitest**
- **Why**: Tests user behavior not implementation details
- **Version**: @testing-library/react 16.1.0, @testing-library/user-event 14.5.2

**E2E Testing: Playwright**
- **Why**: Cross-browser support, auto-waits prevent flaky tests, fastest E2E framework
- **Version**: @playwright/test 1.49.1

**Alternatives considered**:
- **Jest**: Slower than Vitest, requires more configuration for ES modules
- **Cypress**: Good but Playwright is faster and has better TypeScript support

---

## 3. Implementation Specification

### 3.1 Component Breakdown

This section details the major components to be implemented in Phase 1. Each component follows the pattern:
- **Purpose**: What the component accomplishes
- **Implementation Requirements**: Step-by-step build instructions
- **Edge Cases & Error Handling**: Scenarios to handle
- **Dependencies**: What this component relies on
- **Testing Requirements**: Specific tests to write
- **Acceptance Criteria**: When this component is "done"

---

#### Component: Authentication System

**Files Involved**:
- `src/features/auth/components/LoginForm.tsx`
- `src/features/auth/components/RegisterForm.tsx`
- `src/features/auth/components/ProtectedRoute.tsx`
- `src/features/auth/hooks/useLogin.ts`
- `src/features/auth/hooks/useRegister.ts`
- `src/features/auth/hooks/useLogout.ts`
- `src/features/auth/hooks/useCurrentUser.ts`
- `src/features/auth/api/authApi.ts`
- `src/features/auth/schemas/authSchemas.ts`
- `src/features/auth/stores/authStore.ts`
- `src/features/auth/types.ts`

**Purpose**:
Provides secure user authentication with registration, login, logout, and session management. Handles JWT token refresh, protected route navigation, and persistent sessions across page refreshes.

**Implementation Requirements**:

1. **Zod Validation Schemas** (`authSchemas.ts`):
   ```typescript
   import { z } from 'zod'

   export const loginSchema = z.object({
     email: z.string().email('Invalid email address'),
     password: z.string().min(8, 'Password must be at least 8 characters'),
     rememberMe: z.boolean().optional().default(false),
   })

   export const registerSchema = z.object({
     email: z.string().email('Invalid email address'),
     username: z.string()
       .min(3, 'Username must be at least 3 characters')
       .max(20, 'Username must be at most 20 characters')
       .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
     password: z.string()
       .min(8, 'Password must be at least 8 characters')
       .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
       .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
       .regex(/[0-9]/, 'Password must contain at least one number'),
     confirmPassword: z.string(),
     termsAccepted: z.boolean().refine((val) => val === true, {
       message: 'You must accept the terms and conditions',
     }),
   }).refine((data) => data.password === data.confirmPassword, {
     message: "Passwords don't match",
     path: ['confirmPassword'],
   })

   export type LoginFormData = z.infer<typeof loginSchema>
   export type RegisterFormData = z.infer<typeof registerSchema>
   ```

2. **API Functions** (`authApi.ts`):
   ```typescript
   import api from '@/shared/lib/axios'
   import type { User, LoginCredentials, RegisterCredentials } from './types'

   export const authApi = {
     login: async (credentials: LoginCredentials) => {
       const { data } = await api.post<{ user: User }>('/auth/login', credentials)
       return data
     },

     register: async (credentials: RegisterCredentials) => {
       const { data } = await api.post<{ user: User }>('/auth/register', credentials)
       return data
     },

     logout: async () => {
       await api.post('/auth/logout')
     },

     getCurrentUser: async () => {
       const { data } = await api.get<User>('/users/me')
       return data
     },

     refreshToken: async () => {
       const { data } = await api.post('/auth/refresh')
       return data
     },
   }
   ```

3. **Zustand Auth Store** (`authStore.ts`):
   ```typescript
   import { create } from 'zustand'
   import { persist } from 'zustand/middleware'
   import type { User } from './types'

   interface AuthState {
     user: User | null
     isAuthenticated: boolean
     setUser: (user: User | null) => void
     logout: () => void
   }

   export const useAuthStore = create<AuthState>()(
     persist(
       (set) => ({
         user: null,
         isAuthenticated: false,
         setUser: (user) => set({ user, isAuthenticated: !!user }),
         logout: () => set({ user: null, isAuthenticated: false }),
       }),
       {
         name: 'emerald-auth',
         // Only persist user data, not tokens (those are in HTTP-only cookies)
         partialize: (state) => ({ user: state.user }),
       }
     )
   )
   ```

4. **TanStack Query Hooks**:

   `useLogin.ts`:
   ```typescript
   import { useMutation } from '@tanstack/react-query'
   import { useNavigate } from '@tanstack/react-router'
   import { authApi } from '../api/authApi'
   import { useAuthStore } from '../stores/authStore'
   import type { LoginCredentials } from '../types'

   export const useLogin = () => {
     const navigate = useNavigate()
     const setUser = useAuthStore((state) => state.setUser)

     return useMutation({
       mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
       onSuccess: (data) => {
         setUser(data.user)
         navigate({ to: '/' })
       },
     })
   }
   ```

   `useRegister.ts`:
   ```typescript
   import { useMutation } from '@tanstack/react-query'
   import { useNavigate } from '@tanstack/react-router'
   import { authApi } from '../api/authApi'
   import { useAuthStore } from '../stores/authStore'
   import type { RegisterCredentials } from '../types'

   export const useRegister = () => {
     const navigate = useNavigate()
     const setUser = useAuthStore((state) => state.setUser)

     return useMutation({
       mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
       onSuccess: (data) => {
         setUser(data.user)
         navigate({ to: '/' })
       },
     })
   }
   ```

   `useLogout.ts`:
   ```typescript
   import { useMutation, useQueryClient } from '@tanstack/react-query'
   import { useNavigate } from '@tanstack/react-router'
   import { authApi } from '../api/authApi'
   import { useAuthStore } from '../stores/authStore'

   export const useLogout = () => {
     const navigate = useNavigate()
     const logout = useAuthStore((state) => state.logout)
     const queryClient = useQueryClient()

     return useMutation({
       mutationFn: authApi.logout,
       onSuccess: () => {
         logout()
         queryClient.clear() // Clear all cached data
         navigate({ to: '/login' })
       },
     })
   }
   ```

   `useCurrentUser.ts`:
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { authApi } from '../api/authApi'
   import { useAuthStore } from '../stores/authStore'

   export const useCurrentUser = () => {
     const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
     const setUser = useAuthStore((state) => state.setUser)

     return useQuery({
       queryKey: ['currentUser'],
       queryFn: authApi.getCurrentUser,
       enabled: isAuthenticated,
       staleTime: 5 * 60 * 1000, // 5 minutes
       onSuccess: (data) => setUser(data),
       onError: () => setUser(null),
     })
   }
   ```

5. **LoginForm Component**:
   ```typescript
   import { useForm } from 'react-hook-form'
   import { zodResolver } from '@hookform/resolvers/zod'
   import { loginSchema, type LoginFormData } from '../schemas/authSchemas'
   import { useLogin } from '../hooks/useLogin'
   import { Button } from '@/shared/components/ui/Button'
   import { Input } from '@/shared/components/ui/Input'
   import { Label } from '@/shared/components/ui/Label'
   import { Checkbox } from '@/shared/components/ui/Checkbox'

   export const LoginForm = () => {
     const { mutate: login, isPending, error } = useLogin()
     const {
       register,
       handleSubmit,
       formState: { errors },
     } = useForm<LoginFormData>({
       resolver: zodResolver(loginSchema),
     })

     const onSubmit = (data: LoginFormData) => {
       login(data)
     }

     return (
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div>
           <Label htmlFor="email">Email</Label>
           <Input
             id="email"
             type="email"
             autoComplete="email"
             {...register('email')}
             error={errors.email?.message}
           />
         </div>

         <div>
           <Label htmlFor="password">Password</Label>
           <Input
             id="password"
             type="password"
             autoComplete="current-password"
             {...register('password')}
             error={errors.password?.message}
           />
         </div>

         <div className="flex items-center">
           <Checkbox id="rememberMe" {...register('rememberMe')} />
           <Label htmlFor="rememberMe" className="ml-2">
             Remember me
           </Label>
         </div>

         {error && (
           <div className="text-error text-sm" role="alert">
             {error.message}
           </div>
         )}

         <Button type="submit" disabled={isPending} className="w-full">
           {isPending ? 'Signing in...' : 'Sign in'}
         </Button>
       </form>
     )
   }
   ```

6. **RegisterForm Component** (similar structure to LoginForm with password strength indicator):
   ```typescript
   // Include password strength meter
   // Include username availability check (debounced)
   // Include confirm password field
   // Include terms acceptance checkbox
   ```

7. **ProtectedRoute Component**:
   ```typescript
   import { redirect } from '@tanstack/react-router'
   import { useAuthStore } from '../stores/authStore'

   export const protectedRouteBeforeLoad = ({ location }) => {
     const isAuthenticated = useAuthStore.getState().isAuthenticated

     if (!isAuthenticated) {
       throw redirect({
         to: '/login',
         search: {
           redirect: location.href,
         },
       })
     }
   }
   ```

**Edge Cases & Error Handling**:

- [ ] **Invalid credentials**: Display "Invalid email or password" (don't reveal which is wrong)
- [ ] **Network timeout**: Retry once automatically, then show error with "Try again" button
- [ ] **Server error (500)**: Display generic error, log to console for debugging
- [ ] **Email already exists**: Display "Email already registered" on registration
- [ ] **Session expired**: Attempt token refresh, redirect to login if refresh fails
- [ ] **Token refresh race condition**: Queue multiple failed requests, refresh once, retry all
- [ ] **Logout from one tab**: Clear session in all tabs using localStorage event listener
- [ ] **Password strength**: Real-time feedback (weak/medium/strong) as user types
- [ ] **Username availability**: Debounce check by 500ms to avoid excessive API calls
- [ ] **CSRF attack**: SameSite=Strict cookies prevent cross-origin requests

**Dependencies**:

- **Internal**:
  - UI components (Button, Input, Label, Checkbox)
  - Axios client with interceptors
  - TanStack Router for navigation
  - Zustand auth store

- **External**:
  - Backend API endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/refresh`)
  - HTTP-only cookies configured on backend

**Testing Requirements**:

- [ ] **Unit test**: `loginSchema` validates correct email format
- [ ] **Unit test**: `loginSchema` rejects password < 8 characters
- [ ] **Unit test**: `registerSchema` validates password strength requirements
- [ ] **Unit test**: `registerSchema` validates password confirmation match
- [ ] **Integration test**: LoginForm submits correct data on valid input
- [ ] **Integration test**: LoginForm displays validation errors on invalid input
- [ ] **Integration test**: RegisterForm shows password strength indicator
- [ ] **Integration test**: Successful login redirects to dashboard
- [ ] **Integration test**: Failed login displays error message
- [ ] **Integration test**: ProtectedRoute redirects unauthenticated users to login
- [ ] **E2E test**: Complete login flow (navigate to login → fill form → submit → verify redirect)
- [ ] **E2E test**: Complete registration flow
- [ ] **E2E test**: Session persists after page refresh
- [ ] **E2E test**: Logout clears session and redirects to login

**Acceptance Criteria**:

- [ ] User can register with email, username, and password
- [ ] User can log in with email and password
- [ ] User can log out from any page
- [ ] Session persists across page refreshes
- [ ] Token automatically refreshes before expiration
- [ ] Protected routes redirect to login if unauthenticated
- [ ] Login redirects to intended page after authentication
- [ ] All validation errors display clearly
- [ ] Password strength indicator works in real-time
- [ ] "Remember me" extends session duration
- [ ] All tests pass (>80% coverage)

---

#### Component: Design System & UI Components

**Files Involved**:
- `src/shared/components/ui/Button.tsx`
- `src/shared/components/ui/Input.tsx`
- `src/shared/components/ui/Label.tsx`
- `src/shared/components/ui/Checkbox.tsx`
- `src/shared/components/ui/Dialog.tsx`
- `src/shared/components/ui/DropdownMenu.tsx`
- `src/shared/components/ui/Toast.tsx`
- `src/shared/components/ui/Spinner.tsx`
- `src/shared/styles/globals.css`
- `src/shared/styles/theme.css`
- `tailwind.config.ts`

**Purpose**:
Provides reusable, accessible UI components styled with the unique dark-mode aesthetic. All components follow WCAG 2.2 AA standards and support keyboard navigation.

**Implementation Requirements**:

1. **Theme Configuration** (`theme.css`):
   ```css
   @theme {
     /* Backgrounds */
     --color-background: #0a0a0a;
     --color-surface: #141414;
     --color-surface-elevated: #1a1a1a;

     /* Text */
     --color-text-primary: #e8e8e8;
     --color-text-secondary: #a0a0a0;
     --color-text-tertiary: #666666;

     /* Accent */
     --color-accent: #ff3366;
     --color-accent-hover: #ff4477;
     --color-accent-subtle: rgba(255, 51, 102, 0.1);

     /* Semantic */
     --color-success: #00e676;
     --color-error: #ff3366;
     --color-warning: #ffab00;
     --color-info: #2196f3;

     /* Borders */
     --color-border: #1a1a1a;
     --color-border-focus: #ff3366;

     /* Spacing */
     --spacing-xs: 0.25rem;
     --spacing-sm: 0.5rem;
     --spacing-md: 1rem;
     --spacing-lg: 1.5rem;
     --spacing-xl: 2rem;

     /* Typography */
     --font-family: 'Inter', system-ui, sans-serif;
     --text-xs: 0.75rem;
     --text-sm: 0.875rem;
     --text-base: 1rem;
     --text-lg: 1.125rem;
     --text-xl: 1.25rem;
     --text-2xl: 1.5rem;

     /* Radius */
     --radius-sm: 2px;
     --radius-md: 4px;
   }
   ```

2. **Button Component** (`Button.tsx`):
   ```typescript
   import { forwardRef } from 'react'
   import { cva, type VariantProps } from 'class-variance-authority'

   const buttonVariants = cva(
     'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed',
     {
       variants: {
         variant: {
           primary: 'bg-accent text-white hover:bg-accent-hover',
           secondary: 'bg-surface text-text-primary hover:bg-surface-elevated border border-border',
           ghost: 'hover:bg-surface-elevated text-text-primary',
           danger: 'bg-error text-white hover:bg-error/90',
         },
         size: {
           sm: 'h-8 px-3 text-sm',
           md: 'h-10 px-4 text-base',
           lg: 'h-12 px-6 text-lg',
         },
       },
       defaultVariants: {
         variant: 'primary',
         size: 'md',
       },
     }
   )

   interface ButtonProps
     extends React.ButtonHTMLAttributes<HTMLButtonElement>,
       VariantProps<typeof buttonVariants> {}

   export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, variant, size, ...props }, ref) => {
       return (
         <button
           ref={ref}
           className={buttonVariants({ variant, size, className })}
           {...props}
         />
       )
     }
   )
   ```

3. **Input Component** (`Input.tsx`):
   ```typescript
   import { forwardRef } from 'react'

   interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     error?: string
   }

   export const Input = forwardRef<HTMLInputElement, InputProps>(
     ({ className, error, ...props }, ref) => {
       return (
         <div className="space-y-1">
           <input
             ref={ref}
             className={`
               w-full px-3 py-2 bg-surface border border-border rounded-md
               text-text-primary placeholder:text-text-tertiary
               focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
               disabled:opacity-50 disabled:cursor-not-allowed
               ${error ? 'border-error focus:border-error focus:ring-error' : ''}
               ${className}
             `}
             {...props}
           />
           {error && (
             <p className="text-xs text-error" role="alert">
               {error}
             </p>
           )}
         </div>
       )
     }
   )
   ```

4. **Dialog Component** (wraps Radix UI Dialog):
   ```typescript
   import * as DialogPrimitive from '@radix-ui/react-dialog'
   import { X } from 'lucide-react'

   export const Dialog = DialogPrimitive.Root
   export const DialogTrigger = DialogPrimitive.Trigger

   export const DialogContent = forwardRef<
     React.ElementRef<typeof DialogPrimitive.Content>,
     React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
   >(({ className, children, ...props }, ref) => (
     <DialogPrimitive.Portal>
       <DialogPrimitive.Overlay className="fixed inset-0 bg-black/80" />
       <DialogPrimitive.Content
         ref={ref}
         className={`
           fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
           w-full max-w-lg bg-surface-elevated border border-border
           p-6 shadow-lg focus:outline-none
           ${className}
         `}
         {...props}
       >
         {children}
         <DialogPrimitive.Close className="absolute right-4 top-4">
           <X className="h-4 w-4 text-text-secondary hover:text-text-primary" />
         </DialogPrimitive.Close>
       </DialogPrimitive.Content>
     </DialogPrimitive.Portal>
   ))
   ```

5. **Toast Notification System** (using sonner):
   ```typescript
   import { Toaster as Sonner } from 'sonner'

   export const Toaster = () => (
     <Sonner
       theme="dark"
       toastOptions={{
         style: {
           background: 'var(--color-surface-elevated)',
           border: '1px solid var(--color-border)',
           color: 'var(--color-text-primary)',
         },
       }}
     />
   )

   // Usage:
   // import { toast } from 'sonner'
   // toast.success('Login successful')
   // toast.error('Invalid credentials')
   ```

**Edge Cases & Error Handling**:

- [ ] **Focus management**: Dialog traps focus, Escape closes it
- [ ] **Keyboard navigation**: All buttons/inputs accessible via Tab/Shift+Tab
- [ ] **Touch targets**: All interactive elements ≥44px for mobile
- [ ] **Color contrast**: All text meets 4.5:1 contrast ratio (WCAG AA)
- [ ] **Disabled states**: Visually distinct, cursor-not-allowed
- [ ] **Loading states**: Spinner replaces button text, button disabled

**Dependencies**:

- **External**: @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-label, sonner, lucide-react (icons), class-variance-authority

**Testing Requirements**:

- [ ] **Unit test**: Button variants render correct classes
- [ ] **Unit test**: Input displays error message when error prop provided
- [ ] **Integration test**: Dialog opens/closes with keyboard (Escape)
- [ ] **Integration test**: Focus trapped in open Dialog
- [ ] **Accessibility test**: All components pass jest-axe (no WCAG violations)
- [ ] **Visual test**: Storybook stories for all component variants

**Acceptance Criteria**:

- [ ] All 8 base components implemented (Button, Input, Label, Checkbox, Dialog, DropdownMenu, Toast, Spinner)
- [ ] Dark mode theme applied globally
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible on all interactive elements
- [ ] No accessibility violations (jest-axe)

---

#### Component: Application Shell & Navigation

**Files Involved**:
- `src/shared/components/layout/AppShell.tsx`
- `src/shared/components/layout/Header.tsx`
- `src/shared/components/layout/Sidebar.tsx`
- `src/shared/components/layout/UserMenu.tsx`
- `src/shared/stores/uiStore.ts` (Zustand for sidebar state)

**Purpose**:
Provides the main application layout with header, sidebar navigation, and responsive mobile menu. Includes user menu for settings and logout.

**Implementation Requirements**:

1. **UI Store** (`uiStore.ts`):
   ```typescript
   import { create } from 'zustand'
   import { persist } from 'zustand/middleware'

   interface UIState {
     sidebarCollapsed: boolean
     toggleSidebar: () => void
     setSidebarCollapsed: (collapsed: boolean) => void
   }

   export const useUIStore = create<UIState>()(
     persist(
       (set) => ({
         sidebarCollapsed: false,
         toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
         setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
       }),
       {
         name: 'emerald-ui',
       }
     )
   )
   ```

2. **AppShell Component**:
   ```typescript
   import { Outlet } from '@tanstack/react-router'
   import { Header } from './Header'
   import { Sidebar } from './Sidebar'
   import { useUIStore } from '@/shared/stores/uiStore'
   import { useMediaQuery } from '@/shared/hooks/useMediaQuery'

   export const AppShell = () => {
     const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
     const isMobile = useMediaQuery('(max-width: 767px)')

     return (
       <div className="flex h-screen bg-background">
         {/* Sidebar */}
         <Sidebar />

         {/* Main content */}
         <div className="flex-1 flex flex-col overflow-hidden">
           <Header />
           <main className="flex-1 overflow-y-auto p-6">
             <Outlet />
           </main>
         </div>
       </div>
     )
   }
   ```

3. **Sidebar Component**:
   ```typescript
   import { Link } from '@tanstack/react-router'
   import { Home, Wallet, Receipt, Upload, Settings, Shield } from 'lucide-react'
   import { useAuthStore } from '@/features/auth/stores/authStore'
   import { useUIStore } from '@/shared/stores/uiStore'

   const navigation = [
     { name: 'Dashboard', to: '/', icon: Home },
     { name: 'Accounts', to: '/accounts', icon: Wallet },
     { name: 'Transactions', to: '/transactions', icon: Receipt },
     { name: 'Import', to: '/import', icon: Upload },
     { name: 'Settings', to: '/settings', icon: Settings },
   ]

   export const Sidebar = () => {
     const user = useAuthStore((state) => state.user)
     const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)

     return (
       <aside
         className={`
           bg-surface border-r border-border transition-all duration-300
           ${sidebarCollapsed ? 'w-16' : 'w-64'}
         `}
       >
         <nav className="p-4 space-y-2">
           {navigation.map((item) => {
             // Show admin link only if user is admin
             if (item.name === 'Admin' && user?.role !== 'admin') return null

             return (
               <Link
                 key={item.name}
                 to={item.to}
                 className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-elevated text-text-primary transition-colors"
                 activeProps={{
                   className: 'bg-accent-subtle text-accent',
                 }}
               >
                 <item.icon className="h-5 w-5" />
                 {!sidebarCollapsed && <span>{item.name}</span>}
               </Link>
             )
           })}
         </nav>
       </aside>
     )
   }
   ```

4. **Header Component**:
   ```typescript
   import { Menu } from 'lucide-react'
   import { UserMenu } from './UserMenu'
   import { useUIStore } from '@/shared/stores/uiStore'

   export const Header = () => {
     const toggleSidebar = useUIStore((state) => state.toggleSidebar)

     return (
       <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
           <button
             onClick={toggleSidebar}
             className="p-2 hover:bg-surface-elevated rounded-md"
             aria-label="Toggle sidebar"
           >
             <Menu className="h-5 w-5 text-text-primary" />
           </button>
           <h1 className="text-xl font-semibold text-text-primary">
             Emerald Finance
           </h1>
         </div>

         <UserMenu />
       </header>
     )
   }
   ```

5. **UserMenu Component** (uses Radix Dropdown):
   ```typescript
   import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
   import { User, Settings, LogOut } from 'lucide-react'
   import { useNavigate } from '@tanstack/react-router'
   import { useAuthStore } from '@/features/auth/stores/authStore'
   import { useLogout } from '@/features/auth/hooks/useLogout'

   export const UserMenu = () => {
     const user = useAuthStore((state) => state.user)
     const navigate = useNavigate()
     const { mutate: logout } = useLogout()

     return (
       <DropdownMenu.Root>
         <DropdownMenu.Trigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-elevated">
           <User className="h-5 w-5" />
           <span className="text-sm">{user?.username}</span>
         </DropdownMenu.Trigger>

         <DropdownMenu.Portal>
           <DropdownMenu.Content
             className="bg-surface-elevated border border-border rounded-md shadow-lg p-2 min-w-[200px]"
             sideOffset={5}
           >
             <DropdownMenu.Item
               className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface cursor-pointer"
               onSelect={() => navigate({ to: '/settings' })}
             >
               <Settings className="h-4 w-4" />
               Settings
             </DropdownMenu.Item>

             <DropdownMenu.Separator className="h-px bg-border my-2" />

             <DropdownMenu.Item
               className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface cursor-pointer text-error"
               onSelect={() => logout()}
             >
               <LogOut className="h-4 w-4" />
               Logout
             </DropdownMenu.Item>
           </DropdownMenu.Content>
         </DropdownMenu.Portal>
       </DropdownMenu.Root>
     )
   }
   ```

**Edge Cases & Error Handling**:

- [ ] **Mobile sidebar**: Overlay mode on mobile, push mode on desktop
- [ ] **Sidebar state persistence**: Remember collapsed state in localStorage
- [ ] **Active route highlighting**: Current page highlighted in sidebar
- [ ] **Admin-only links**: Hide admin links for non-admin users
- [ ] **Keyboard navigation**: Tab through navigation items, Enter to activate
- [ ] **Focus management**: Dropdown menu traps focus when open

**Dependencies**:

- **Internal**: UI components (Button), auth store, TanStack Router
- **External**: @radix-ui/react-dropdown-menu, lucide-react

**Testing Requirements**:

- [ ] **Unit test**: Sidebar shows/hides links based on user role
- [ ] **Integration test**: Sidebar toggle button works
- [ ] **Integration test**: Active link highlighted correctly
- [ ] **Integration test**: UserMenu dropdown opens/closes
- [ ] **Integration test**: Logout button triggers logout mutation
- [ ] **E2E test**: Navigation between pages works
- [ ] **E2E test**: Mobile sidebar overlay works on small screens

**Acceptance Criteria**:

- [ ] Header displays app name and user menu
- [ ] Sidebar shows all navigation links
- [ ] Sidebar collapses/expands on toggle
- [ ] Active route highlighted in sidebar
- [ ] User menu shows username and logout option
- [ ] Logout button clears session and redirects to login
- [ ] Responsive on mobile (hamburger menu)

---

#### Component: Axios Interceptors & Token Refresh

**Files Involved**:
- `src/shared/lib/axios.ts`

**Purpose**:
Handles JWT token refresh automatically when access token expires. Queues failed requests during refresh to prevent race conditions.

**Implementation Requirements**:

```typescript
import axios from 'axios'
import { authApi } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token refresh queue to prevent race conditions
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh token
        await authApi.refreshToken()

        // Token refreshed successfully, process queued requests
        processQueue()
        isRefreshing = false

        // Retry original request
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        processQueue(refreshError)
        isRefreshing = false

        useAuthStore.getState().logout()
        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
```

**Edge Cases & Error Handling**:

- [ ] **Multiple simultaneous 401s**: Queue all requests, refresh once, retry all
- [ ] **Refresh token expired**: Redirect to login, don't retry
- [ ] **Network offline**: Don't attempt refresh, show offline message
- [ ] **Infinite refresh loop**: Prevent with `_retry` flag
- [ ] **Race condition**: Use queue to serialize requests during refresh

**Dependencies**:

- **Internal**: authApi, authStore
- **External**: axios

**Testing Requirements**:

- [ ] **Unit test**: 401 response triggers token refresh
- [ ] **Unit test**: Refresh failure redirects to login
- [ ] **Integration test**: Multiple 401s trigger only one refresh
- [ ] **Integration test**: Queued requests retry after successful refresh
- [ ] **Integration test**: Original request succeeds after token refresh

**Acceptance Criteria**:

- [ ] Access token refresh happens automatically on 401
- [ ] Multiple concurrent 401s trigger only one refresh
- [ ] Failed refresh redirects to login
- [ ] Successful refresh retries original request

---

### 3.2 File Structure

```
emerald-frontend/
├── .features/                     # Feature documentation (existing)
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions: test, lint, build
├── public/
│   └── fonts/
│       └── Inter/                 # Self-hosted Inter font
├── src/
│   ├── app/
│   │   ├── App.tsx               # Root app component
│   │   ├── main.tsx              # Entry point
│   │   └── providers.tsx         # Query, Router providers
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── LoginForm.tsx
│   │       │   ├── RegisterForm.tsx
│   │       │   └── ProtectedRoute.tsx
│   │       ├── hooks/
│   │       │   ├── useLogin.ts
│   │       │   ├── useRegister.ts
│   │       │   ├── useLogout.ts
│   │       │   └── useCurrentUser.ts
│   │       ├── api/
│   │       │   └── authApi.ts
│   │       ├── schemas/
│   │       │   └── authSchemas.ts
│   │       ├── stores/
│   │       │   └── authStore.ts
│   │       └── types.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/                # Base components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Label.tsx
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── DropdownMenu.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   └── layout/
│   │   │       ├── AppShell.tsx
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── UserMenu.tsx
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── lib/
│   │   │   ├── axios.ts          # Axios instance + interceptors
│   │   │   └── queryClient.ts    # TanStack Query config
│   │   ├── styles/
│   │   │   ├── globals.css       # Global styles
│   │   │   └── theme.css         # CSS variables (dark mode)
│   │   ├── stores/
│   │   │   └── uiStore.ts        # Zustand UI state
│   │   └── types/
│   │       └── api.ts            # API response types
│   ├── routes/                    # TanStack Router (file-based)
│   │   ├── __root.tsx            # Root layout
│   │   ├── index.tsx             # Dashboard (placeholder)
│   │   ├── login.tsx             # Login page
│   │   └── register.tsx          # Registration page
│   └── vite-env.d.ts
├── tests/
│   ├── e2e/
│   │   └── auth.spec.ts          # Playwright E2E tests
│   └── setup.ts                  # Test setup (MSW, etc.)
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── index.html
├── package.json
├── pnpm-lock.yaml
├── playwright.config.ts
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 4. Implementation Roadmap

### Phase Breakdown

Phase 1 is a single cohesive phase with sequential sub-tasks. All tasks must be completed for Phase 1 to be considered done.

#### Sub-Phase 1.1: Project Setup & Configuration (Size: S, Priority: P0)

**Goal**: Establish development environment with all tooling configured

**Scope**:
- ✅ Include: pnpm initialization, Vite + React + TypeScript setup, ESLint/Prettier config, Git hooks
- ❌ Exclude: Any UI components, authentication logic

**Detailed Tasks**:

1. [ ] Initialize project with Vite
   ```bash
   pnpm create vite@latest emerald-frontend -- --template react-swc-ts
   cd emerald-frontend
   pnpm install
   ```

2. [ ] Configure TypeScript strict mode
   - Update `tsconfig.json` with strict options (see Section 2.3)
   - Add path aliases: `@/*` → `./src/*`

3. [ ] Set up ESLint and Prettier
   ```bash
   pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
   pnpm add -D eslint-plugin-react eslint-plugin-react-hooks
   ```
   - Create `.eslintrc.cjs` with React + TypeScript rules
   - Create `.prettierrc` with formatting rules

4. [ ] Configure Husky for Git hooks
   ```bash
   pnpm add -D husky lint-staged
   pnpm exec husky init
   ```
   - Add pre-commit hook: lint-staged (runs ESLint + Prettier on staged files)

5. [ ] Set up environment variables
   - Create `.env.example` with `VITE_API_URL`
   - Add `.env` to `.gitignore`

6. [ ] Install core dependencies
   ```bash
   # React ecosystem
   pnpm add react@18.3.1 react-dom@18.3.1

   # Routing & State
   pnpm add @tanstack/react-router @tanstack/react-query zustand

   # Forms & Validation
   pnpm add react-hook-form @hookform/resolvers zod

   # UI & Styling
   pnpm add tailwindcss@4.0.0 postcss autoprefixer
   pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label
   pnpm add sonner lucide-react class-variance-authority

   # HTTP & Utils
   pnpm add axios

   # Dev dependencies
   pnpm add -D @types/react @types/react-dom
   pnpm add -D @vitejs/plugin-react-swc
   ```

7. [ ] Configure Tailwind CSS v4
   - Create `tailwind.config.ts`
   - Create `postcss.config.js`
   - Import Tailwind in `src/shared/styles/globals.css`

8. [ ] Configure Vite
   - Update `vite.config.ts` with path aliases and build optimizations (see Section 2.4)

**Dependencies**: None

**Validation Criteria**:
- [ ] `pnpm dev` starts development server on port 5173
- [ ] `pnpm build` creates production build without errors
- [ ] `pnpm lint` runs without errors
- [ ] TypeScript compiles with no errors
- [ ] Pre-commit hook runs on git commit

**Estimated Effort**: 1 day

---

#### Sub-Phase 1.2: Design System & Base Components (Size: M, Priority: P0)

**Goal**: Implement dark-mode theme and reusable UI components

**Scope**:
- ✅ Include: Theme CSS variables, 8 base components, Radix UI wrappers
- ❌ Exclude: Complex components (tables, charts), feature-specific components

**Detailed Tasks**:

1. [ ] Set up theme CSS variables
   - Create `src/shared/styles/theme.css` (see Section 3.1)
   - Import theme in `globals.css`

2. [ ] Load Inter font
   - Download Inter font files (woff2) to `public/fonts/Inter/`
   - Add `@font-face` rules in `globals.css`

3. [ ] Implement Button component
   - Create `src/shared/components/ui/Button.tsx` (see Section 3.1)
   - Add variants: primary, secondary, ghost, danger
   - Add sizes: sm, md, lg
   - Use class-variance-authority for variant management

4. [ ] Implement Input component
   - Create `src/shared/components/ui/Input.tsx`
   - Support error display
   - Support disabled state
   - Support password visibility toggle (separate PasswordInput component)

5. [ ] Implement Label component
   - Wrap @radix-ui/react-label
   - Style with Tailwind

6. [ ] Implement Checkbox component
   - Custom checkbox styled with Tailwind
   - Accessible with proper ARIA labels

7. [ ] Implement Dialog component
   - Wrap @radix-ui/react-dialog
   - Custom styling for dark mode
   - Close button with X icon

8. [ ] Implement DropdownMenu component
   - Wrap @radix-ui/react-dropdown-menu
   - Custom styling for dark mode

9. [ ] Implement Toast component
   - Use sonner library
   - Configure for dark mode
   - Create Toaster wrapper component

10. [ ] Implement Spinner component
    - Simple loading spinner with CSS animation
    - Multiple sizes

11. [ ] Create Storybook stories (optional but recommended)
    - Set up Storybook for component showcase
    - Create stories for each component variant

**Dependencies**: Sub-Phase 1.1 (project setup)

**Validation Criteria**:
- [ ] All 8 components render without errors
- [ ] Dark mode theme applied correctly
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All interactive elements have focus indicators
- [ ] No console errors or warnings

**Estimated Effort**: 3 days

---

#### Sub-Phase 1.3: Authentication System (Size: L, Priority: P0)

**Goal**: Implement login, registration, JWT token management, and protected routes

**Scope**:
- ✅ Include: Login/register forms, Zod validation, TanStack Query hooks, Zustand auth store, Axios interceptors
- ❌ Exclude: Password reset, email verification, 2FA (future phases)

**Detailed Tasks**:

1. [ ] Set up Axios client with interceptors
   - Create `src/shared/lib/axios.ts` (see Section 3.1)
   - Implement token refresh queue to prevent race conditions

2. [ ] Configure TanStack Query
   - Create `src/shared/lib/queryClient.ts`
   - Set staleTime, cacheTime, retry defaults

3. [ ] Create auth types
   - Create `src/features/auth/types.ts`
   - Define User, LoginCredentials, RegisterCredentials types

4. [ ] Create Zod validation schemas
   - Create `src/features/auth/schemas/authSchemas.ts`
   - Implement loginSchema and registerSchema (see Section 3.1)

5. [ ] Create auth API functions
   - Create `src/features/auth/api/authApi.ts`
   - Implement login, register, logout, getCurrentUser, refreshToken

6. [ ] Create Zustand auth store
   - Create `src/features/auth/stores/authStore.ts`
   - Persist user data to localStorage (not tokens!)

7. [ ] Create TanStack Query hooks
   - Create `useLogin`, `useRegister`, `useLogout`, `useCurrentUser` hooks
   - Implement optimistic updates and error handling

8. [ ] Implement LoginForm component
   - Create `src/features/auth/components/LoginForm.tsx`
   - Wire up React Hook Form + Zod validation
   - Connect to useLogin mutation
   - Add "Remember me" checkbox
   - Add password visibility toggle

9. [ ] Implement RegisterForm component
   - Create `src/features/auth/components/RegisterForm.tsx`
   - Add password strength indicator
   - Add username availability check (debounced)
   - Add confirm password field
   - Add terms acceptance checkbox

10. [ ] Implement protected route logic
    - Create `src/features/auth/components/ProtectedRoute.tsx`
    - Use TanStack Router beforeLoad hook
    - Redirect to /login if unauthenticated
    - Preserve intended URL after login

11. [ ] Create login/register routes
    - Create `src/routes/login.tsx`
    - Create `src/routes/register.tsx`
    - Import and render LoginForm/RegisterForm

12. [ ] Test authentication flow
    - Manual testing: register → login → logout
    - Verify tokens in cookies (use browser DevTools)
    - Verify session persistence after refresh

**Dependencies**: Sub-Phase 1.2 (UI components)

**Validation Criteria**:
- [ ] User can register with valid credentials
- [ ] User can log in with valid credentials
- [ ] Invalid credentials show error message
- [ ] Session persists across page refreshes
- [ ] Token refresh works automatically on 401
- [ ] Logout clears session and redirects to login
- [ ] Protected routes redirect to login if unauthenticated

**Estimated Effort**: 5 days

---

#### Sub-Phase 1.4: Application Shell & Navigation (Size: M, Priority: P0)

**Goal**: Create responsive layout with header, sidebar, and user menu

**Scope**:
- ✅ Include: AppShell, Header, Sidebar, UserMenu, responsive mobile menu
- ❌ Exclude: Dashboard content (placeholder only)

**Detailed Tasks**:

1. [ ] Create UI Zustand store
   - Create `src/shared/stores/uiStore.ts`
   - Track sidebar collapsed state
   - Persist to localStorage

2. [ ] Create useMediaQuery hook
   - Create `src/shared/hooks/useMediaQuery.ts`
   - Detect mobile/tablet/desktop breakpoints

3. [ ] Implement Header component
   - Create `src/shared/components/layout/Header.tsx`
   - Add app logo/name
   - Add sidebar toggle button (hamburger icon)
   - Add UserMenu

4. [ ] Implement Sidebar component
   - Create `src/shared/components/layout/Sidebar.tsx`
   - Add navigation links (Dashboard, Accounts, Transactions, Import, Settings)
   - Highlight active link with TanStack Router activeProps
   - Support collapsed state
   - Hide on mobile (overlay mode)

5. [ ] Implement UserMenu component
   - Create `src/shared/components/layout/UserMenu.tsx`
   - Use Radix DropdownMenu
   - Show username from auth store
   - Add Settings and Logout options

6. [ ] Implement AppShell component
   - Create `src/shared/components/layout/AppShell.tsx`
   - Compose Header + Sidebar + main content area
   - Use TanStack Router <Outlet /> for nested routes
   - Handle responsive layout (mobile vs desktop)

7. [ ] Create dashboard route (placeholder)
   - Create `src/routes/index.tsx`
   - Add placeholder content: "Dashboard - Coming in Phase 2"

8. [ ] Update root route
   - Create `src/routes/__root.tsx`
   - Wrap with AppShell
   - Add protected route check (beforeLoad)

9. [ ] Test navigation
   - Click sidebar links → verify route changes
   - Click user menu logout → verify logout flow
   - Resize browser → verify mobile responsiveness

**Dependencies**: Sub-Phase 1.3 (auth system)

**Validation Criteria**:
- [ ] Header displays app name and user menu
- [ ] Sidebar shows all navigation links
- [ ] Active route highlighted in sidebar
- [ ] Sidebar collapses/expands on toggle
- [ ] Mobile menu works on small screens
- [ ] User menu shows username and logout
- [ ] Logout redirects to login page

**Estimated Effort**: 3 days

---

#### Sub-Phase 1.5: Testing Infrastructure & Tests (Size: M, Priority: P0)

**Goal**: Set up testing tools and write tests for Phase 1 components

**Scope**:
- ✅ Include: Vitest setup, React Testing Library setup, Playwright setup, unit/integration/E2E tests
- ❌ Exclude: Performance testing, visual regression testing (future)

**Detailed Tasks**:

1. [ ] Set up Vitest
   ```bash
   pnpm add -D vitest jsdom @testing-library/jest-dom
   ```
   - Create `vitest.config.ts`
   - Create `tests/setup.ts` with @testing-library/jest-dom import

2. [ ] Set up React Testing Library
   ```bash
   pnpm add -D @testing-library/react @testing-library/user-event
   ```
   - Create test utilities in `tests/utils.tsx`

3. [ ] Set up MSW (Mock Service Worker)
   ```bash
   pnpm add -D msw
   ```
   - Create mock handlers for auth API endpoints
   - Set up server in `tests/setup.ts`

4. [ ] Set up Playwright
   ```bash
   pnpm create playwright
   ```
   - Configure `playwright.config.ts`
   - Set baseURL to `http://localhost:5173`

5. [ ] Write unit tests for validation schemas
   - Test loginSchema validates email format
   - Test loginSchema validates password length
   - Test registerSchema validates password strength
   - Test registerSchema validates password confirmation

6. [ ] Write integration tests for LoginForm
   - Test form submission with valid data
   - Test form displays validation errors
   - Test loading state during submission
   - Test error message display on API error

7. [ ] Write integration tests for RegisterForm
   - Test password strength indicator updates
   - Test confirm password validation
   - Test terms checkbox validation

8. [ ] Write integration tests for navigation
   - Test sidebar navigation between routes
   - Test active link highlighting
   - Test protected route redirect

9. [ ] Write E2E tests with Playwright
   - Test complete login flow (navigate → fill form → submit → verify redirect)
   - Test complete registration flow
   - Test session persistence after refresh
   - Test logout clears session

10. [ ] Write accessibility tests
    ```bash
    pnpm add -D jest-axe
    ```
    - Test all UI components pass jest-axe (no WCAG violations)

11. [ ] Set up test coverage reporting
    - Configure Vitest coverage
    - Add coverage threshold: 80%

12. [ ] Add test scripts to package.json
    ```json
    {
      "scripts": {
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:e2e": "playwright test",
        "test:coverage": "vitest --coverage"
      }
    }
    ```

**Dependencies**: Sub-Phase 1.4 (all components implemented)

**Validation Criteria**:
- [ ] `pnpm test` runs all unit/integration tests
- [ ] `pnpm test:e2e` runs all E2E tests
- [ ] Test coverage >80%
- [ ] All tests pass
- [ ] No console errors during test runs

**Estimated Effort**: 4 days

---

#### Sub-Phase 1.6: CI/CD Pipeline & Documentation (Size: S, Priority: P1)

**Goal**: Set up automated testing and deployment pipeline

**Scope**:
- ✅ Include: GitHub Actions workflow, README documentation
- ❌ Exclude: Deployment to production (manual for now)

**Detailed Tasks**:

1. [ ] Create GitHub Actions workflow
   - Create `.github/workflows/ci.yml`
   ```yaml
   name: CI

   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         - uses: pnpm/action-setup@v4
           with:
             version: 9

         - uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'pnpm'

         - name: Install dependencies
           run: pnpm install --frozen-lockfile

         - name: Lint
           run: pnpm lint

         - name: Type check
           run: pnpm tsc --noEmit

         - name: Test
           run: pnpm test:coverage

         - name: Build
           run: pnpm build
   ```

2. [ ] Update README.md
   - Add project description
   - Add installation instructions with pnpm
   - Add development setup guide
   - Add testing instructions
   - Add tech stack list
   - Add folder structure overview

3. [ ] Create CONTRIBUTING.md
   - Add code style guidelines
   - Add commit message conventions
   - Add PR process

4. [ ] Create .env.example
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

5. [ ] Test CI pipeline
   - Push to GitHub
   - Verify workflow runs successfully

**Dependencies**: Sub-Phase 1.5 (tests implemented)

**Validation Criteria**:
- [ ] GitHub Actions workflow runs on push
- [ ] All CI checks pass (lint, test, build)
- [ ] README has clear setup instructions
- [ ] .env.example documents all required variables

**Estimated Effort**: 1 day

---

### Implementation Sequence

```
Sub-Phase 1.1: Project Setup (1 day)
  ↓
Sub-Phase 1.2: Design System (3 days)
  ↓
Sub-Phase 1.3: Authentication (5 days)
  ↓
Sub-Phase 1.4: App Shell (3 days)
  ↓
Sub-Phase 1.5: Testing (4 days)
  ↓
Sub-Phase 1.6: CI/CD (1 day)

Total: 17 days (~3.5 weeks for 1 developer)
```

**Rationale for ordering**:
- **1.1 first**: Must have project infrastructure before writing any code
- **1.2 before 1.3**: Auth forms need UI components (Button, Input, etc.)
- **1.3 before 1.4**: App shell needs auth state for user menu, protected routes
- **1.5 after 1.4**: Can't test components until they're implemented
- **1.6 last**: CI/CD requires tests to run

**Quick Wins**:
- After 1.2: Visual design system is showcased (can demo to stakeholders)
- After 1.3: Login/register flow works (can onboard test users)

---

## 5. Simplicity & Design Validation

### Simplicity Checklist

- [x] **Is this the SIMPLEST solution that solves the problem?**
  - Yes. We're using industry-standard libraries (React, TanStack, Radix) with proven patterns. Avoided over-engineering (no GraphQL, no complex state machines, no micro-frontends).

- [x] **Have we avoided premature optimization?**
  - Yes. No complex caching strategies, no service workers, no code splitting beyond route-level. Performance optimizations are planned for later phases when we have real usage data.

- [x] **Does this align with existing patterns in the codebase?**
  - N/A for Phase 1 (greenfield project). We're establishing patterns that future phases will follow.

- [x] **Can we deliver value in smaller increments?**
  - Yes. Each sub-phase delivers functional value:
    - 1.2 → Visual design system
    - 1.3 → Working authentication
    - 1.4 → Navigable app shell

- [x] **Are we solving the actual problem vs. a perceived problem?**
  - Yes. Phase 1 directly addresses the requirement for secure authentication and foundational architecture. No features added beyond what's specified in the feature description.

### Alternatives Considered

**Alternative 1: Server-Side Rendering (Next.js)**
- **Why not chosen**: Self-hosted environment doesn't benefit from edge deployment. SSR adds complexity without clear performance gains for an authenticated SPA. Client-side rendering is simpler for this use case.

**Alternative 2: Redux Toolkit for state management**
- **Why not chosen**: TanStack Query + Zustand achieves the same goals with 40% less boilerplate. Redux is overkill for Phase 1 requirements. Easier learning curve for future developers.

**Alternative 3: React Router v7**
- **Why not chosen**: Lacks type safety for route params and search params. TanStack Router provides compile-time safety critical for complex financial app navigation.

**Alternative 4: Material-UI for component library**
- **Why not chosen**: Too opinionated for unique aesthetic requirements. Radix UI's headless approach gives full styling control while maintaining accessibility.

**Rationale**:
The proposed approach (React SPA with TanStack ecosystem + Radix UI) provides the optimal balance of:
- **Developer experience**: Modern tooling with excellent TypeScript support
- **Performance**: Fast development builds, optimized production bundles
- **Flexibility**: Full control over unique dark-mode aesthetic
- **Maintainability**: Industry-standard patterns, easy to find developers
- **Security**: Proven authentication patterns, XSS/CSRF protection

---

## 6. Security Considerations

### Authentication Security

1. **JWT Storage**
   - ✅ Access tokens in HTTP-only cookies (not localStorage)
   - ✅ SameSite=Strict to prevent CSRF
   - ✅ Secure flag (HTTPS only in production)
   - ✅ Short-lived access tokens (15 minutes)
   - ✅ Refresh token rotation on each use

2. **Password Security**
   - ✅ Client-side validation (min 8 chars, uppercase, lowercase, number)
   - ✅ Server-side validation (never trust client)
   - ✅ Passwords never stored in browser (form state only)
   - ✅ Password visibility toggle (not visible by default)

3. **Session Management**
   - ✅ Automatic token refresh before expiration
   - ✅ Logout clears all tokens and cache
   - ✅ Logout from one tab syncs to other tabs (localStorage event)
   - ✅ Session timeout after inactivity (configurable)

### XSS Prevention

1. **React Built-in Protection**
   - ✅ JSX auto-escapes `{}` expressions
   - ✅ Never use `dangerouslySetInnerHTML` without DOMPurify sanitization

2. **Content Security Policy**
   ```
   Content-Security-Policy:
     default-src 'self';
     script-src 'self';
     style-src 'self' 'unsafe-inline';
     img-src 'self' data:;
     font-src 'self';
     connect-src 'self';
     frame-ancestors 'none';
     base-uri 'self';
     form-action 'self';
   ```

3. **Input Validation**
   - ✅ Zod validates all form inputs client-side
   - ✅ Server re-validates (never trust client)
   - ✅ Regex prevents special characters in usernames

### CSRF Prevention

1. **SameSite Cookies**
   - ✅ `SameSite=Strict` on all auth cookies
   - ✅ Blocks cross-origin requests automatically

2. **CORS Configuration**
   - Backend configured to only accept requests from frontend origin
   - No wildcard (*) origins allowed

### Dependency Security

1. **Regular Updates**
   ```bash
   pnpm audit                    # Check for vulnerabilities
   pnpm audit --fix              # Auto-fix if possible
   pnpm update --interactive --latest  # Update dependencies interactively
   ```

2. **Dependabot**
   - Enabled in GitHub settings
   - Configured for pnpm in `.github/dependabot.yml`
   - Auto-creates PRs for security patches

3. **Pinned Versions**
   - `pnpm-lock.yaml` pins exact versions
   - Prevents supply chain attacks from compromised packages

### HTTPS Enforcement

- ✅ All production traffic over HTTPS
- ✅ HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- ✅ Redirect HTTP → HTTPS (nginx configuration)

### Security Headers

```nginx
# nginx.conf
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

## 7. Performance Targets & Optimization

### Performance Budget

| Metric | Target | Max Acceptable | How to Measure |
|--------|--------|----------------|----------------|
| **Initial Bundle** | < 150 KB gzipped | 200 KB | `pnpm build` output |
| **Time to Interactive** | < 2.0s | 2.5s | Lighthouse |
| **First Contentful Paint** | < 1.5s | 2.0s | Lighthouse |
| **Largest Contentful Paint** | < 2.0s | 2.5s | Lighthouse |
| **Cumulative Layout Shift** | < 0.05 | 0.1 | Lighthouse |
| **Lighthouse Performance** | > 90 | > 85 | Lighthouse |
| **Lighthouse Accessibility** | 100 | 100 | Lighthouse |

### Optimization Strategies

1. **Code Splitting**
   - Route-based splitting (automatic with TanStack Router + Vite)
   - Manual chunks for heavy libraries (recharts in future phases)
   ```javascript
   // vite.config.ts
   manualChunks: {
     'react-vendor': ['react', 'react-dom'],
     'router': ['@tanstack/react-router'],
     'query': ['@tanstack/react-query'],
   }
   ```

2. **Font Optimization**
   - Self-host Inter font (no external CDN requests)
   - Only load needed weights (400, 500, 600, 700)
   - `font-display: swap` for faster rendering

3. **Image Optimization**
   - SVG icons only (no PNG/JPG in Phase 1)
   - Lazy load images (future phases)

4. **Lazy Loading**
   - Route components lazy loaded:
   ```typescript
   const LoginRoute = lazy(() => import('./routes/login'))
   ```

5. **Tree Shaking**
   - Import only needed Radix components
   - Import only needed lucide-react icons

6. **Asset Caching**
   ```nginx
   # Cache static assets for 1 year
   location ~* \.(js|css|woff|woff2)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

### Monitoring

- **Lighthouse CI** in GitHub Actions (runs on every PR)
- **Bundle analyzer** during build:
  ```bash
  pnpm add -D rollup-plugin-visualizer
  ```
- **Chrome DevTools** Performance tab for runtime profiling

---

## 8. Definition of Done

Phase 1 is complete when ALL of the following criteria are met:

### Functional Requirements

- [ ] User can register a new account with email, username, and password
- [ ] User can log in with email and password
- [ ] User can log out from any page
- [ ] Session persists across page refreshes
- [ ] JWT tokens refresh automatically when expired
- [ ] Protected routes redirect to login if unauthenticated
- [ ] Login redirects to intended destination after authentication
- [ ] Navigation between routes works (Dashboard, Accounts, Transactions, Import, Settings)

### Design Requirements

- [ ] Dark mode design system fully implemented with CSS variables
- [ ] All 8 base UI components complete (Button, Input, Label, Checkbox, Dialog, DropdownMenu, Toast, Spinner)
- [ ] Typography scale applied consistently (Inter font)
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Responsive layouts work on mobile (320px), tablet (768px), and desktop (1024px+)
- [ ] No visual bugs or layout shifts

### Code Quality

- [ ] TypeScript compiles with no errors (strict mode)
- [ ] ESLint runs with no errors
- [ ] Prettier formatting applied to all files
- [ ] No console errors or warnings in browser
- [ ] Code reviewed and approved by at least one other developer

### Testing

- [ ] All unit tests pass (validation schemas, utility functions)
- [ ] All integration tests pass (forms, navigation, auth flow)
- [ ] All E2E tests pass (login, registration, logout, session persistence)
- [ ] Test coverage >80% for new code
- [ ] Accessibility tests pass (jest-axe, no WCAG violations)

### Security

- [ ] JWT tokens stored in HTTP-only cookies (not localStorage)
- [ ] CSRF protection enabled (SameSite=Strict cookies)
- [ ] XSS prevention: no `dangerouslySetInnerHTML` without sanitization
- [ ] Input validation (client + server)
- [ ] Password strength requirements enforced
- [ ] No sensitive data in localStorage
- [ ] Content Security Policy headers configured

### Performance

- [ ] Initial bundle size < 150KB gzipped
- [ ] Time to Interactive < 2.5s
- [ ] First Contentful Paint < 1.5s
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score = 100

### Documentation

- [ ] README.md updated with setup instructions
- [ ] .env.example documents all required variables
- [ ] Code comments added for complex logic
- [ ] TypeScript types documented with JSDoc (where non-obvious)

### CI/CD

- [ ] GitHub Actions workflow runs on every push
- [ ] All CI checks pass (lint, test, build)
- [ ] Pre-commit hooks run successfully

---

## 9. References & Related Documents

### Official Documentation

**Package Manager:**
- [pnpm Documentation](https://pnpm.io/)
- [pnpm CLI Reference](https://pnpm.io/cli/install)
- [pnpm Workspaces](https://pnpm.io/workspaces)

**Core Technologies:**
- [React 18 Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

**UI & Styling:**
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Radix Colors](https://www.radix-ui.com/colors)

**Forms & Validation:**
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

**Testing:**
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)

**Security:**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

### Research Documents

- [Personal Finance Frontend Research](./.features/research/20251119_personal-finance-frontend.md) - Comprehensive technical research (16,000+ words)

### Related Design Documents

- [Phase 1 Feature Description](./.features/descriptions/phases/phase-1-foundation.md) - Original feature specification

### External Resources

**Authentication:**
- [TanStack Router Authentication Guide](https://tanstack.com/router/v1/docs/framework/react/how-to/setup-authentication)
- [Mastering JWT Authentication with Refresh Tokens](https://medium.com/@njihiamark/mastering-jwt-authentication-with-refresh-tokens-in-nestjs-react-google-email-auth-e4f1e8c8c21e)

**Security:**
- [React Security Best Practices 2025](https://corgea.com/Learn/react-security-best-practices-2025)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

**Design:**
- [Dark UI Design Principles](https://www.toptal.com/designers/ui/dark-ui-design)
- [Accessible Dark Mode](https://www.smashingmagazine.com/2022/06/accessible-dark-mode-web/)

**Performance:**
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)

---

## 10. Appendices

### Appendix A: Package.json Script Reference

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```

### Appendix B: Environment Variables

```bash
# .env.example

# Backend API base URL
VITE_API_URL=http://localhost:8000/api

# App environment
VITE_APP_ENV=development

# Optional: Enable debug logging
VITE_DEBUG=false
```

### Appendix C: Folder Structure (Expanded)

```
emerald-frontend/
├── .features/
│   ├── descriptions/
│   │   └── phases/
│   │       └── phase-1-foundation.md
│   ├── research/
│   │   └── 20251119_personal-finance-frontend.md
│   └── plans/
│       └── 20251119_phase-1-foundation-authentication.md (this file)
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   └── fonts/
│       └── Inter/
│           ├── Inter-Regular.woff2
│           ├── Inter-Medium.woff2
│           ├── Inter-SemiBold.woff2
│           └── Inter-Bold.woff2
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── providers.tsx
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── LoginForm.tsx
│   │       │   ├── RegisterForm.tsx
│   │       │   ├── PasswordInput.tsx
│   │       │   └── ProtectedRoute.tsx
│   │       ├── hooks/
│   │       │   ├── useLogin.ts
│   │       │   ├── useRegister.ts
│   │       │   ├── useLogout.ts
│   │       │   └── useCurrentUser.ts
│   │       ├── api/
│   │       │   └── authApi.ts
│   │       ├── schemas/
│   │       │   └── authSchemas.ts
│   │       ├── stores/
│   │       │   └── authStore.ts
│   │       └── types.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Label.tsx
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── DropdownMenu.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   └── layout/
│   │   │       ├── AppShell.tsx
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── UserMenu.tsx
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── lib/
│   │   │   ├── axios.ts
│   │   │   └── queryClient.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── theme.css
│   │   ├── stores/
│   │   │   └── uiStore.ts
│   │   ├── types/
│   │   │   └── api.ts
│   │   └── utils/
│   │       ├── cn.ts (classnames utility)
│   │       └── formatters.ts (formatCurrency, formatDate - Phase 2)
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── e2e/
│   │   └── auth.spec.ts
│   ├── fixtures/
│   │   └── mockUser.ts
│   ├── mocks/
│   │   └── handlers.ts (MSW handlers)
│   └── setup.ts
├── .env
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── CONTRIBUTING.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── playwright.config.ts
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

### Appendix D: Git Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Updating build tasks, package manager configs, etc.

**Examples:**
```
feat(auth): implement login form with validation

- Add LoginForm component with React Hook Form
- Add Zod schema for email and password validation
- Wire up useLogin mutation

Closes #12
```

```
fix(auth): prevent token refresh race condition

- Implement request queue during token refresh
- Process queued requests after successful refresh
- Redirect to login if refresh fails

Fixes #45
```

---

**End of Implementation Plan**

---

**Document Metadata:**
- **Plan Date**: November 19, 2025
- **Word Count**: ~15,000+
- **Estimated Implementation Time**: 17 days (3.5 weeks, 1 developer)
- **Phase**: Phase 1 - Foundation & Authentication
- **Next Phase**: Phase 2 - Accounts & Transactions (to be planned)

This implementation plan provides a complete blueprint for building Phase 1 of the Emerald Personal Finance Platform frontend. Developers can follow this plan step-by-step to implement all required features with confidence.
