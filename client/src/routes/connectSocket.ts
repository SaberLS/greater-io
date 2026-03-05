import type { ClientLoaderFunctionArgs } from 'react-router'
import { redirect } from 'react-router'
import { protectedSocket } from '../services'
import { store } from '../store'
import { setupLobbyListeners } from '../store/slices/lobby/lobbyListeners'

async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const state = store.getState()

  if (!protectedSocket.isConnected) {
    try {
      if (!state.auth.token) throw new Error('No auth token')

      await protectedSocket.connect(state.auth.token)
      setupLobbyListeners(store.dispatch)
    } catch {
      throw redirect('/')
    }
  }

  return null
}

export { MinimalOutlet as default } from '../common/components/MinimalOutlet'
export { clientLoader }
