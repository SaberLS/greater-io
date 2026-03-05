import { Button } from 'primereact/button'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { protectedSocket } from '../../services'
import { startLobby } from '../../services/sockets'
import { useLobbyState } from '../../services/sockets/LobbyClient'
import { selectAuth } from '../../store/slices'

function LobbyView() {
  const lobby = useLobbyState()
  const auth = useSelector(selectAuth)
  const currentUser = auth.user
  const me = lobby?.members[currentUser!.id]

  const navigate = useNavigate()

  const isInGame = useMemo(() => me!.status === 'in-game', [me!.status])
  const isReady = useMemo(() => me!.status === 'ready', [me!.status])
  const isOwner = useMemo(
    () => lobby?.ownerId === me!.user.id,
    [lobby?.ownerId]
  )

  const canStart = useMemo(() => {
    if (lobby?.members === undefined) return false

    const members = Object.values(lobby.members)
    if (members.length < 2) return false

    return members.every(member => member.status === 'ready')
  }, [lobby])

  const possibleStatus = useMemo(
    () => (isReady ? 'not-ready' : 'ready'),
    [isReady]
  )

  const changeStatus = () => {
    if (isInGame) return

    protectedSocket.instance.emit('lobby:status', possibleStatus)
  }

  const onClickStartGame = async () => {
    try {
      const lobby = await startLobby()
      console.log(lobby)
      navigate(`/game/${lobby.id}`)
    } catch (err) {}
  }

  if (!lobby) {
    return (
      <div>
        <h2>No active lobby</h2>
      </div>
    )
  }

  const membersArray = Object.values(lobby.members)

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Lobby ID: {lobby.id}</h2>
      <p>Status: {lobby.status}</p>
      <p>
        Members: {lobby.currentMemberCount} / {lobby.maxMembers}
      </p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {membersArray.map(member => {
          const isOwner = member.user.id === lobby.ownerId

          return (
            <li
              key={member.user.id}
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>
                  {member.user.username}
                  {isOwner && ' 👑'}
                </strong>
              </div>

              <span
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  background:
                    member.status === 'ready' ? '#4caf50'
                    : member.status === 'in-game' ? '#2196f3'
                    : '#999',
                  color: 'white',
                  fontSize: '0.8rem',
                }}
              >
                {member.status}
              </span>
            </li>
          )
        })}
      </ul>

      <Button
        disabled={isInGame}
        label={possibleStatus}
        onClick={changeStatus}
      />
      {isOwner && (
        <Button
          disabled={!canStart}
          label="Start"
          onClick={onClickStartGame}
        />
      )}
    </div>
  )
}

export { LobbyView }
