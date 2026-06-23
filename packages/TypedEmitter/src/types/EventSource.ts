import type { Emitter } from '../Emitter'
import type { EventMap } from './Event'

interface IEventSource<TEvents extends EventMap> {
  readonly on: Emitter<AppendTarget<TEvents, this>>['on']
  readonly once: Emitter<AppendTarget<TEvents, this>>['once']
  readonly off: Emitter<AppendTarget<TEvents, this>>['off']
  readonly dispose: Emitter<AppendTarget<TEvents, this>>['dispose']
}

type SourceOfEvents<
  TArget extends object,
  TEvents extends EventMap,
> = IEventSource<TEvents> & TArget

type AppendTarget<TEvents extends EventMap, out Target extends object> = {
  readonly [K in keyof TEvents]: TEvents[K] & { readonly target: Target }
}

export type { AppendTarget, IEventSource, SourceOfEvents }
