import type { Config } from '../types'

interface ILobbyStore<
  T extends Config.LobbyTypes,
  TLobby extends Config.BASE.LobbyInstance<T>,
> {
  deleteUserById(userId: T['member']['user']['id']): void
  deleteLobbyById(lobbyId: T['id']): void

  getLobbyById(lobbyId: T['id']): TLobby | undefined
  getLobbyByUserId(userId: T['member']['user']['id']): TLobby | undefined
  hasUser(userId: T['member']['user']['id']): boolean

  addLobby(userId: T['member']['user']['id'], lobby: TLobby): TLobby
  addUserToLobby(userId: T['member']['user']['id'], lobby: TLobby): TLobby
}

export type { ILobbyStore }
