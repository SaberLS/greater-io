import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  layout('mainApp.ts', [index('home.ts'), route('*', 'Catchall.tsx')]),
  // route('login', 'Login.tsx'),
] satisfies RouteConfig
