import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

interface ILobby {
  id: number
  name: string
  currentPlayers: number
  totalSlots: number
}

interface LobbyTableProps {
  lobbies: ILobby[]
  onJoin: (lobbyId: number) => void
}

function LobbyTable({ lobbies, onJoin }: LobbyTableProps) {
  // Custom body for Join button
  const joinButtonBody = (rowData: ILobby) => (
    <Button
      onClick={() => onJoin(rowData.id)}
      label="Join"
    />
  )

  return (
    <div className="p-4 w-full">
      <DataTable
        value={lobbies}
        stripedRows
      >
        <Column
          field="name"
          header="Lobby Name"
        />
        <Column
          header="Players"
          body={(rowData: ILobby) =>
            `${rowData.currentPlayers} / ${rowData.totalSlots}`
          }
        />
        <Column
          header="Action"
          body={joinButtonBody}
        />
      </DataTable>
    </div>
  )
}

export { LobbyTable }
export type { ILobby, LobbyTableProps }
