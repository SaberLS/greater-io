import type * as Lobby from '../../../Lobby'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GameMemberTypes extends Lobby.Config.BASE.MemberTypes {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GameMemberEvents<T extends GameMemberTypes> extends Lobby.Config.BASE
  .MemberEvents<T> {}

interface GameMemberInstance<T extends GameMemberTypes> extends Lobby.Config
  .BASE.MemberInstance<T> {
  get isReady(): boolean
}

interface GameMemberCtx<
  TData extends GameMemberTypes,
> extends Lobby.MemberCtx<TData> {
  readonly instance: GameMemberInstance<TData>
  readonly events: GameMemberEvents<TData>
}

export type {
  GameMemberCtx,
  GameMemberEvents,
  GameMemberInstance,
  GameMemberTypes,
}
