import { useSyncExternalStore } from 'react'
import { lobbyClient, Snapshot } from '../LobbyClient'

function useLobbySelector<T>(selector: (s: Snapshot) => T) {
  const snapshot = useSyncExternalStore(
    lobbyClient.subscribe,
    lobbyClient.getSnapshot
  )

  return selector(snapshot)
}

function useLobbyClient() {
  return useLobbySelector(s => s)
}

function useLobbyState() {
  return useLobbySelector(s => s.lobbyState)
}

function useGameState() {
  return useLobbySelector(s => s.gameState)
}

function useGameStartAt() {
  return useLobbySelector(s => s.startAt)
}

export { useGameStartAt, useGameState, useLobbyClient, useLobbyState }
