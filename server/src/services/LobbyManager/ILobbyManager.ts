import type { ILobby, LobbyPlayer } from './Lobby/ILobby'

interface ILobbyManager<
  TLobbyID,
  TPlayerID,
  TPlayer extends LobbyPlayer<TPlayerID>,
  TLobby extends ILobby<TLobbyID, TPlayerID, TPlayer>,
> {
  add(key: TLobbyID, lobby: TLobby): void
  get(key: TLobbyID): TLobby | undefined
  has(key: TLobbyID): boolean
  clear(): void

  readonly size: number

  delete(key: TLobbyID): boolean
}

export type { ILobbyManager }
