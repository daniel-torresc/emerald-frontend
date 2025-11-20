import '@tanstack/react-router'

declare module '@tanstack/react-router' {
  interface RouterContext {
    auth: {
      isAuthenticated: boolean
    }
  }
}
