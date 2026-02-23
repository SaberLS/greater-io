import type { ILobby, LobbyBaseTypes } from '../Lobby/ILobby'

interface ILobbyStore<T extends LobbyBaseTypes, TLobby extends ILobby<T>> {
  deleteUserById(userId: T['member']['user']['id']): void
  deleteLobbyById(lobbyId: T['id']): void

  getLobbyById(lobbyId: T['id']): TLobby | undefined
  getLobbyByUserId(userId: T['member']['user']['id']): TLobby | undefined
  hasUser(userId: T['member']['user']['id']): boolean

  addLobby(userId: T['member']['user']['id'], lobby: TLobby): TLobby
  addUserToLobby(userId: T['member']['user']['id'], lobby: TLobby): TLobby
}

export type { ILobbyStore }
