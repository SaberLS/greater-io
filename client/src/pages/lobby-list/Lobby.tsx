import { Button } from 'primereact/button'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { FormEventHandler, useState } from 'react'
import { useNavigate } from 'react-router'
import { lobbyClient } from '../../services/sockets/LobbyClient'
import { Layout } from './Layout'
import { type ILobby, LobbyTable } from './LobbyTable'

const placeholderLobbies: ILobby[] = [
  { id: 1, name: 'Lobby #1', currentPlayers: 2, totalSlots: 4 },
  { id: 2, name: 'Lobby #2', currentPlayers: 1, totalSlots: 4 },
  { id: 3, name: 'Lobby #3', currentPlayers: 0, totalSlots: 6 },
]

function Lobby() {
  const [lobbyId, setlobbyId] = useState<string>('')
  const navigate = useNavigate()

  const onClickCreateLobby = async () => {
    try {
      const lobby = await lobbyClient.createLobbyAndWait()

      navigate(`/lobby/${lobby.id}`)
    } catch (err) {}
  }

  const onSubmitjoinLobby: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    try {
      // TODO: lobbyId should be validated
      const lobby = await lobbyClient.joinLobbyAndWait(lobbyId)
      navigate(`/lobby/${lobby.id}`)
    } catch (err) {}
  }

  return (
    <Layout>
      <div className="w-full flex justify-around">
        <form onSubmit={onSubmitjoinLobby}>
          <FloatLabel>
            <label htmlFor="lobby-id">Lobby ID</label>
            <div className="p-inputgroup flex-1">
              <InputText
                id="lobby-id"
                value={lobbyId}
                onChange={e => setlobbyId(e.target.value)}
                placeholder="join-lobby-with-this-id"
                className="w-full focus-visible:rounded-r-none!"
                tabIndex={1}
              />
              <Button
                iconPos="right"
                label="Join"
                type="submit"
              />
            </div>
          </FloatLabel>
        </form>
        <Button
          label="create"
          className="w-3"
          onClick={onClickCreateLobby}
        />
      </div>
      <LobbyTable
        lobbies={placeholderLobbies}
        onJoin={() => {}}
      />
    </Layout>
  )
}

export { Lobby }
