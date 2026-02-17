import type { ILobbyUserState } from '../Lobby/ILobby'
import type { LobbyMemberStatus } from '../types'
import type {
  ILobbyMember,
  ILobbyMemberState,
  ILobbyUser,
} from './ILobbyMember'

class LobbyMember<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> implements ILobbyMember<
  TUserID,
  TUser,
  ILobbyUserState<TUserID, TUser>,
  LobbyMemberStatus,
  ILobbyMemberState<TUserID, ILobbyUserState<TUserID, TUser>, LobbyMemberStatus>
> {
  #user: TUser
  #status: LobbyMemberStatus

  constructor(user: TUser, status: LobbyMemberStatus = 'not-ready') {
    this.#user = user
    this.#status = status
  }

  get user() {
    return this.#user
  }

  get state() {
    return Object.freeze({
      user: { id: this.user.id, username: this.user.username },
      status: this.status,
    })
  }

  get status() {
    return this.#status
  }

  set status(status: LobbyMemberStatus) {
    if (status === 'in-game' || status === 'ready' || status === 'not-ready')
      this.#status = status
    else throw new Error(`${String(status)} is not valid member status`)
  }

  get isReady() {
    return this.status === 'ready'
  }
}

export { LobbyMember }
