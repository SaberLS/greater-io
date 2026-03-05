import { protectedSocket } from '../index'
type LobbyState = {
  id: `${string}-${string}-${string}-${string}-${string}`
  ownerId: number
  status: 'open' | 'closed' | 'game-in-progress' | 'creating-game'
  maxMembers: number
  currentMemberCount: number
  members: Record<
    number,
    {
      user: {
        id: number
        username: string
      }
      status: 'ready' | 'in-game' | 'not-ready'
    }
  >
}

async function createLobby(): Promise<LobbyState> {
  if (!protectedSocket.isConnected) throw new Error('Socket is not connected')

  // Wait for lobby state from server
  const state = await new Promise<LobbyState>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Lobby start timed out')),
      5000
    )

    const onError = (err: string) => {
      cleanup()
      reject(new Error(err))
    }

    const onState = (state: LobbyState) => {
      cleanup()
      resolve(state)
    }

    const cleanup = () => {
      clearTimeout(timer)
      protectedSocket.instance.off('lobby:error', onError)
      protectedSocket.instance.off('lobby:state', onState)
    }

    protectedSocket.instance.once('lobby:error', onError)
    protectedSocket.instance.once('lobby:state', onState)

    protectedSocket.instance.emit('lobby:create')
  })

  return state
}

async function joinLobby(id: LobbyState['id']): Promise<LobbyState> {
  if (!protectedSocket.isConnected) throw new Error('Socket is not connected')

  // Wait for lobby state from server
  const state = await new Promise<LobbyState>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Lobby start timed out')),
      5000
    )

    const onError = (err: string) => {
      cleanup()
      reject(new Error(err))
    }

    const onState = (state: LobbyState) => {
      cleanup()
      resolve(state)
    }

    const cleanup = () => {
      clearTimeout(timer)
      protectedSocket.instance.off('lobby:error', onError)
      protectedSocket.instance.off('lobby:state', onState)
    }

    protectedSocket.instance.once('lobby:error', onError)
    protectedSocket.instance.once('lobby:state', onState)

    protectedSocket.instance.emit('lobby:join', id)
  })

  return state
}

async function startLobby(): Promise<LobbyState> {
  if (!protectedSocket.isConnected) throw new Error('Socket is not connected')

  const state = await new Promise<LobbyState>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Lobby start timed out')),
      5000
    )

    const onError = (err: string) => {
      cleanup()
      reject(new Error(err))
    }

    const onState = (state: LobbyState) => {
      cleanup()
      resolve(state)
    }

    const cleanup = () => {
      clearTimeout(timer)
      protectedSocket.instance.off('lobby:error', onError)
      protectedSocket.instance.off('lobby:state', onState)
    }

    protectedSocket.instance.once('lobby:error', onError)
    protectedSocket.instance.once('lobby:state', onState)

    protectedSocket.instance.emit('lobby:start')
  })

  return state
}

export { createLobby, joinLobby, startLobby }
export type { LobbyState }
