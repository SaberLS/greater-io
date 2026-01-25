type LobbyStatus = 'open' | 'full' | 'closed' | 'in-game'

interface LobbyPlayer<TId> {
  id: TId
}

interface ILobby<TLobbyID, TPlayerID, TPlayer extends LobbyPlayer<TPlayerID>> {
  id: TLobbyID
  ownerId: TPlayerID
  status: LobbyStatus
  players: Map<TPlayerID, TPlayer>
  maxPlayers: number
}

export type { ILobby, LobbyPlayer, LobbyStatus }
