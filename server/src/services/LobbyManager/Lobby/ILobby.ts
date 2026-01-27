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

export type { ILobby, LobbyPlayer, LobbyStatus }
