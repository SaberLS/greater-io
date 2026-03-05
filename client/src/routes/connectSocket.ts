import type { ClientLoaderFunctionArgs } from 'react-router'
import { redirect } from 'react-router'
import { protectedSocket } from '../services'
import { lobbyClient } from '../services/sockets/LobbyClient'
import { store } from '../store'

async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const state = store.getState()

  if (!protectedSocket.isConnected) {
    try {
      if (!state.auth.token) throw new Error('No auth token')

      await protectedSocket.connect(state.auth.token)
      lobbyClient.connectListeners()
    } catch {
      throw redirect('/')
    }
  }

  return null
}

export { MinimalOutlet as default } from '../common/components/MinimalOutlet'
export { clientLoader }
