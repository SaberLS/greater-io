import type { ITypedMap } from '../../../TypedMap/types'
import type { EventMap } from './Event'

interface TypedEmitter<TEvents extends EventMap> {
  on: EventHandler<TEvents>
  once: EventHandler<TEvents>
  off: EventHandler<TEvents>

  get listeners(): ITypedMap<{
    [K in keyof TEvents]?: Set<Handler<TEvents, K>> | undefined
  }>

  dispose(): void

  emit: Emit<TEvents>
}

type EmitArgs<TEvents extends EventMap, K extends keyof TEvents> = TEvents[K]

type Emit<TEvents extends EventMap> = <K extends keyof TEvents>(
  event: K,
  eventObject: EmitArgs<TEvents, K>
) => void

type EventHandler<TEvents extends EventMap> = <K extends keyof TEvents>(
  event: K,
  handler: Handler<TEvents, K>
) => void

type Handler<TEvents extends EventMap, K extends keyof TEvents> = (
  eventObject: EmitArgs<TEvents, K>
) => void

export type { Emit, EmitArgs, EventHandler, Handler, TypedEmitter }
