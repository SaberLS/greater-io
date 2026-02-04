import type {
  LobbyPlayerResult,
  LobbyPlayerState,
  LobbyPlayerStatus,
} from '../types'
import type { ILobbyPlayer, ILobbyUser, IPlayerResult } from './ILobbyPlayers'

class LobbyPlayer<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> implements ILobbyPlayer<
  TUserID,
  TUser,
  LobbyPlayerStatus,
  LobbyPlayerState<TUserID, TUser>,
  LobbyPlayerResult
> {
  #user: TUser
  #result: IPlayerResult
  #status: LobbyPlayerStatus

  constructor(
    user: TUser,
    result: IPlayerResult = { score: 0 },
    status: LobbyPlayerStatus = 'not-ready'
  ) {
    this.#user = user
    this.#result = result
    this.#status = status
  }

  get user() {
    return this.#user
  }

  get state() {
    const s = {
      user: { id: this.user.id, username: this.user.username },
      result: this.result,
      status: this.status,
    }
    Object.freeze(s)

    return s
  }

  get result() {
    return this.#result
  }

  get status() {
    return this.#status
  }

  set status(status: LobbyPlayerStatus) {
    if (status === 'in-game' || status === 'ready' || status === 'not-ready')
      this.#status = status
    else throw new Error(`${status} is not valid player status`)
  }

  get isReady() {
    return this.status === 'ready'
  }
}

export { LobbyPlayer }
