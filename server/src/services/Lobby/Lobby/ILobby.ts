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
  get id(): T['id']
  get owner(): T['member']['user'] | undefined
  get status(): T['status']
  set status(status: T['status'])
  get isEmpty(): boolean
  get isFull(): boolean
  get isReady(): boolean

  // counterState: number

  get maxMembers(): number
  get membersSize(): number
  get members(): Readonly<Map<T['member']['user']['id'], T['member']>>

  add(user: T['member']['user']): void
  remove(user: T['member']['user']): void

  hasUser(userId: T['member']['user']['id']): boolean
  isOwner(user: T['member']['user']): boolean

  changeUserStatus(
    userId: T['member']['user']['id'],
    status: T['member']['status']
  ): void

  close(): void
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
