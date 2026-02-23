import type { Callbacks } from '../../../utils'
import type { ILobbyMember, ILobbyUser } from '../LobbyMember'
import type { Config } from '../types'

type LobbyBaseTypes = Config.LobbyTypes<
  Config.BASE.LobbyID,
  Config.BASE.LobbyStatus,
  ILobbyMember<
    Config.MemberTypes<ILobbyUser<Config.BASE.UserID>, Config.BASE.MemberStatus>
  >
>
type LobbyBaseStatefullTypes = Config.LobbyTypes<
  Config.BASE.LobbyID,
  Config.BASE.LobbyStatus,
  Config.Statefull<
    ILobbyMember<
      Config.MemberTypes<
        ILobbyUser<Config.BASE.UserID>,
        Config.BASE.MemberStatus
      >
    >,
    Config.BASE.MemberState
  >
>

type TOfLobby<TLobby extends ILobby<LobbyBaseTypes>> =
  TLobby extends ILobby<infer T> ? T : never

interface ILobby<T extends LobbyBaseTypes> {
  id: T['id']
  owner: T['member']['user'] | undefined
  status: T['status']
  isEmpty: boolean
  isFull: boolean
  isReady: boolean

  counterState: number

  maxMembers: number
  membersSize: number
  members: Readonly<Map<T['member']['user']['id'], T['member']>>

  // game_instance: Game // game object itself

  add(user: T['member']['user']): void
  remove(user: T['member']['user']): void

  hasUser(userId: T['member']['user']['id']): boolean
  isOwner(user: T['member']['user']): boolean

  changeUserStatus(
    userId: T['member']['user']['id'],
    status: T['member']['status']
  ): void

  close(): void

  start(callbacks: Partial<Callbacks<string>>): Promise<void>
  abortStart(reason: string): void
}

interface LobbyStartCallbacks<TAbortReason, TLobbyState> {
  onStart: (lobby: TLobbyState) => void
  onTick: (count: number, lobby: TLobbyState) => void
  onEnd: (lobby: TLobbyState) => void
  onAbort: (lobby: TLobbyState, reason: TAbortReason) => void
}

interface ILobbyState<T extends LobbyBaseStatefullTypes> {
  id: T['id']
  ownerId: T['member']['user']['id'] | undefined
  status: T['status']
  maxMembers: number
  currentMemberCount: number
  members: Readonly<Record<T['member']['user']['id'], T['member']['state']>>
}

export type {
  ILobby,
  ILobbyState,
  LobbyBaseStatefullTypes,
  LobbyBaseTypes,
  LobbyStartCallbacks,
  TOfLobby,
}
