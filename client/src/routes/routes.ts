import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  layout('mainApp/mainApp.ts', [
    index('mainApp/home.ts'),
    route('login', 'mainApp/login.ts'),
    layout('mainApp/protected.ts', [
      layout('mainApp/connectSocket.ts', [
        route('lobby', 'mainApp/lobby-list.ts'),
      ]),
    ]),
  ]),
  layout('protected.ts', [
    layout('connectSocket.ts', [route('lobby/:lobbyId', 'lobby/lobby.ts')]),
  ]),

  route('*', 'Catchall.tsx'),
] satisfies RouteConfig
