import type { UserID } from '../../../models'

type LobbyStatus = 'open' | 'full' | 'closed' | 'in-game'

interface LobbyPlayer<TId> {
  id: TId
}

interface ILobby<TLobbyID, TPlayer extends LobbyPlayer<UserID>> {
  id: TLobbyID
  ownerId: UserID | undefined
  status: LobbyStatus
  players: Map<UserID, TPlayer>
  maxPlayers: number
}

interface ILobbyState<
  TLobbyID,
  TPlayer extends LobbyPlayer<UserID>,
> extends Readonly<{
  readonly id: TLobbyID
  readonly ownerId: UserID | undefined
  readonly status: LobbyStatus
  readonly maxPlayers: number
  readonly currentPlayerCount: number
  readonly players: {
    [key: UserID]: Readonly<TPlayer>
  }
}> {}

export type { ILobby, ILobbyState, LobbyPlayer, LobbyStatus }
