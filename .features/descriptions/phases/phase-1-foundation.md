# Phase 1: Foundation & Authentication

**Status:** 🔵 Planning
**Priority:** Critical
**Estimated Effort:** 2-3 weeks
**Dependencies:** None (foundational phase)

---

## Overview

Phase 1 establishes the foundational architecture and authentication system for the Emerald Personal Finance Platform. This phase focuses on creating a solid, scalable foundation with authentication, routing, state management, and the unique dark-mode design system.

**Key Principle:** Build the foundation right—everything else depends on it.

---

## Goals

1. ✅ Set up project infrastructure with modern tooling (pnpm, Vite, TypeScript)
2. ✅ Establish the unique dark-mode design system and component library
3. ✅ Implement secure authentication (login, registration, JWT handling)
4. ✅ Create the base application shell with navigation
5. ✅ Set up state management architecture (TanStack Query + Zustand)
6. ✅ Implement responsive layouts for mobile, tablet, and desktop
7. ✅ Configure routing with type safety

---

## Core Features

### 1. Project Infrastructure

**Setup:**
- Initialize project with Vite 6 + React 18 + TypeScript 5.7
- Configure pnpm 9 as package manager
- Set up ESLint, Prettier, and TypeScript strict mode
- Configure path aliases (`@/` for src)
- Set up Git hooks with Husky (lint-staged)

**Build Configuration:**
- Vite configuration with SWC for React transforms
- Environment variable management (.env files)
- Development and production build scripts
- Bundle analysis setup

**Testing Foundation:**
- Vitest configuration for unit tests
- React Testing Library setup
- Playwright configuration for E2E tests
- Test utilities and helpers

**Deliverables:**
- [ ] Working dev server with HMR
- [ ] Production build pipeline
- [ ] Testing infrastructure ready
- [ ] CI/CD pipeline (GitHub Actions)

---

### 2. Design System & Theme

**Dark Mode Foundation:**
- CSS variables for dark theme colors
- Tailwind v4 configuration with custom theme
- Typography scale and font loading (Inter)
- Color palette (#0a0a0a background, #e8e8e8 text, #ff3366 accent)
- Spacing and sizing system

**Base Components:**
- Button (primary, secondary, ghost variants)
- Input (text, password, email)
- Label and helper text
- Error message display
- Loading spinner
- Toast notifications (success, error, info)

**Radix UI Integration:**
- Dialog/Modal primitive wrapper
- Dropdown Menu primitive wrapper
- Tooltip primitive wrapper
- Custom styling without card/shadow clichés

**Responsive System:**
- Breakpoints (mobile: 320-767px, tablet: 768-1023px, desktop: 1024px+)
- Mobile-first approach
- Touch-friendly sizing (44px minimum tap targets)

**Deliverables:**
- [ ] Theme configuration file
- [ ] Base component library (8-10 components)
- [ ] Storybook or component showcase
- [ ] Dark mode fully implemented
- [ ] Typography system documented

---

### 3. Authentication System

**Login Page:**
- Email/username + password form
- "Remember me" checkbox
- Password visibility toggle
- Form validation with Zod schema
- Loading states during submission
- Error handling and display
- Redirect to dashboard on success

**Registration Page:**
- Email, username, password, confirm password
- Real-time validation feedback
- Password strength indicator
- Username availability check (debounced)
- Terms acceptance checkbox
- Success message and auto-login

**JWT Token Management:**
- HTTP-only cookie storage (access token)
- Refresh token rotation
- Axios interceptor for 401 handling
- Automatic token refresh on expiry
- Logout clears all tokens
- Expired session detection and redirect

**Session Persistence:**
- Session state in Zustand store
- User profile data caching with TanStack Query
- Automatic re-authentication on page refresh
- Logout from all tabs (localStorage sync)

**Protected Routes:**
- Route guard component
- Redirect to login if unauthenticated
- Preserve intended destination after login
- Loading state while checking auth

**Deliverables:**
- [ ] Login page with full validation
- [ ] Registration page with strength indicator
- [ ] JWT token flow implemented
- [ ] Protected route system working
- [ ] Logout functionality
- [ ] Session persistence across refreshes

---

### 4. Application Shell & Navigation

**App Layout:**
- Header with logo and user menu
- Sidebar navigation (collapsible on mobile)
- Main content area
- Footer (optional, minimal)
- Mobile hamburger menu

**Navigation Structure:**
- Dashboard (home)
- Accounts
- Transactions
- Import
- Categories
- Settings
- Admin (if user has permission)

**Routing Setup:**
- TanStack Router with file-based routes
- Type-safe navigation
- Route parameters and search params
- Nested layouts
- 404 Not Found page
- Loading states for route transitions

**User Menu:**
- User name/email display
- Settings link
- Logout button
- Theme toggle (for future light mode)

**Deliverables:**
- [ ] Application shell layout
- [ ] Navigation sidebar with active states
- [ ] Routing infrastructure
- [ ] User menu with dropdown
- [ ] Mobile-responsive navigation

---

### 5. State Management Architecture

**TanStack Query Setup:**
- Query client configuration
- Custom hooks for auth endpoints:
  - `useLogin()` mutation
  - `useRegister()` mutation
  - `useLogout()` mutation
  - `useCurrentUser()` query
- Query key factory pattern
- Optimistic updates configuration
- Error handling patterns

**Zustand Stores:**
- UI state store (theme, sidebar collapsed, modals)
- Auth state store (user, isAuthenticated, tokens)
- Filter state store (for future transaction filtering)

**API Client:**
- Axios instance with base configuration
- Request interceptor (add auth headers)
- Response interceptor (handle 401, refresh tokens)
- Error response typing
- Retry logic for failed requests

**Deliverables:**
- [ ] Query client configured
- [ ] Auth hooks implemented
- [ ] Zustand stores created
- [ ] Axios client with interceptors
- [ ] Error boundary for API errors

---

### 6. Accessibility Foundation

**WCAG 2.2 AA Compliance:**
- Color contrast ratios (4.5:1 for text)
- Focus indicators on all interactive elements
- Keyboard navigation support
- Skip to main content link
- ARIA labels where needed
- Screen reader announcements for dynamic content

**Form Accessibility:**
- Label associations with inputs
- Error announcements
- Required field indicators
- Help text for complex fields

**Deliverables:**
- [ ] Accessibility checklist started
- [ ] Focus management working
- [ ] Keyboard navigation tested
- [ ] ARIA labels on auth forms

---

## Technical Specifications

### Technology Stack

```
Package Manager: pnpm 9+
Framework: React 18.3+
Language: TypeScript 5.7+ (strict mode)
Build Tool: Vite 6.x
Routing: TanStack Router v1.x
State Management: TanStack Query v5 + Zustand v5
Styling: Tailwind CSS v4 + CSS variables
UI Primitives: Radix UI
Forms: React Hook Form v7 + Zod v3
HTTP Client: Axios
Testing: Vitest + React Testing Library + Playwright
```

### Folder Structure

```
emerald-frontend/
├── .features/               # Feature documentation
├── .github/                 # GitHub Actions workflows
├── public/                  # Static assets
├── src/
│   ├── app/                # App initialization
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── providers.tsx   # React Query, Zustand providers
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
│   │       │   └── authSchemas.ts  # Zod schemas
│   │       ├── stores/
│   │       │   └── authStore.ts    # Zustand
│   │       └── types.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/          # Base components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Label.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   └── Toast.tsx
│   │   │   └── layout/
│   │   │       ├── AppShell.tsx
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── UserMenu.tsx
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── lib/
│   │   │   ├── axios.ts     # Axios instance
│   │   │   └── queryClient.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── theme.css    # CSS variables
│   │   └── types/
│   │       └── api.ts       # API response types
│   ├── routes/              # TanStack Router
│   │   ├── __root.tsx
│   │   ├── index.tsx        # Dashboard (placeholder)
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── vite-env.d.ts
│   └── main.tsx
├── tests/
│   ├── e2e/                 # Playwright tests
│   └── setup.ts             # Test setup
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── package.json
├── pnpm-lock.yaml
├── playwright.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## API Endpoints Required

Phase 1 requires these backend endpoints:

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout current session
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/change-password` - Changes user password

---

## Testing Requirements

### Unit Tests (Vitest)
- Form validation schemas (Zod)
- Custom hooks (auth hooks)
- Utility functions
- Store logic (Zustand)

### Integration Tests (React Testing Library)
- Login form submission
- Registration form validation
- Protected route redirects
- Navigation interactions
- Token refresh flow

### E2E Tests (Playwright)
- Complete login flow
- Complete registration flow
- Session persistence after refresh
- Logout clears session
- Protected routes redirect to login

**Test Coverage Target:** > 80% for Phase 1

---

## Design Requirements

### Color Palette

```css
/* Dark Mode (Primary) */
--background: #0a0a0a
--surface: #141414
--surface-elevated: #1a1a1a
--text-primary: #e8e8e8
--text-secondary: #a0a0a0
--text-tertiary: #666666
--accent: #ff3366
--accent-hover: #ff4477
--accent-subtle: rgba(255, 51, 102, 0.1)

/* Semantic Colors */
--success: #00e676
--error: #ff3366
--warning: #ffab00
--info: #2196f3
```

### Typography

```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif

/* Scale */
--text-xs: 0.75rem     /* 12px */
--text-sm: 0.875rem    /* 14px */
--text-base: 1rem      /* 16px */
--text-lg: 1.125rem    /* 18px */
--text-xl: 1.25rem     /* 20px */
--text-2xl: 1.5rem     /* 24px */
--text-3xl: 1.875rem   /* 30px */
--text-4xl: 2.25rem    /* 36px */

/* Weight */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Component Design Patterns

**Button:**
- No rounded-lg (max 4px radius)
- Typography-based hierarchy
- Hover: subtle background change + scale
- Focus: accent-colored outline
- Disabled: reduced opacity

**Input:**
- Minimal border (1px, subtle color)
- Focus: accent-colored border
- Error: error-colored border + message below
- No shadows or heavy styling

**Forms:**
- Stack labels above inputs
- Clear validation feedback
- Inline errors below fields
- Submit button at bottom

---

## Performance Targets

- Initial bundle size: < 150KB gzipped
- Time to Interactive: < 2.5s
- First Contentful Paint: < 1.5s
- Lighthouse Performance: > 90
- Lighthouse Accessibility: 100

---

## Security Checklist

- [ ] Passwords not visible by default (with toggle)
- [ ] HTTPS enforced (in production)
- [ ] JWT in HTTP-only cookies
- [ ] CSRF protection (SameSite=Strict)
- [ ] XSS prevention (React escapes by default)
- [ ] Input validation (client + server)
- [ ] Rate limiting login attempts (backend)
- [ ] Password strength requirements
- [ ] No sensitive data in localStorage
- [ ] Content Security Policy headers

---

## Definition of Done

Phase 1 is complete when:

- [ ] User can register a new account
- [ ] User can log in with valid credentials
- [ ] User can log out
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to login
- [ ] Dark mode design system is fully implemented
- [ ] Base component library is complete
- [ ] Navigation works on mobile and desktop
- [ ] All Phase 1 tests pass (>80% coverage)
- [ ] Accessibility audit passes (WCAG AA)
- [ ] Performance targets met
- [ ] Documentation updated
- [ ] Code reviewed and approved

---

## Success Metrics

- **User Experience:** Login completes in < 2 seconds
- **Accessibility:** Keyboard navigation works for all auth flows
- **Performance:** Bundle size under target
- **Code Quality:** No TypeScript errors, ESLint warnings
- **Test Coverage:** > 80% coverage
- **Mobile:** Auth flows work smoothly on mobile devices

---

## Dependencies & Blockers

**Backend Requirements:**
- Auth endpoints must be available (`/api/auth/*`)
- CORS configured for frontend origin
- Cookie settings configured correctly

**External:**
- None (no third-party auth services in Phase 1)

**Potential Blockers:**
- Backend API delays
- Design system complexity
- Routing architecture decisions

---

## Next Phase Preview

Phase 2 will build on this foundation:
- Account list and creation
- Basic transaction viewing
- Dashboard with account overview
- First data visualizations

**Phase 1 provides:**
- Authenticated user context
- Routing infrastructure
- Component library
- API client with auth
- Dark mode design system
