import { protectedSocket } from '../../../services'
import { AppDispatch } from '../../store'
import { lobbyCleared, lobbyUpdated } from './lobby'

export function setupLobbyListeners(dispatch: AppDispatch) {
  protectedSocket.instance.on('lobby:state', state => {
    dispatch(lobbyUpdated(state))
  })

  protectedSocket.instance.on('lobby:closed', () => {
    dispatch(lobbyCleared())
  })

  protectedSocket.instance.on('lobby:error', e => {
    alert(e)
  })

  protectedSocket.instance.on('disconnect', () => {
    // clear or keep optimistic state
    console.log('socket disconnected')
  })
}
