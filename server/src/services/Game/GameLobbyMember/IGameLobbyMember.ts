import type { Config, ILobbyMember } from '../../Lobby'

interface IGameLobbyMember<
  T extends Config.MemberTypes,
> extends ILobbyMember<T> {
  get isReady(): boolean
}

export type { IGameLobbyMember }
