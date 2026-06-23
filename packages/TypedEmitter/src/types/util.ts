import type { EventMap } from './Event'
import type { IEventSource } from './EventSource'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventsOf<TSource extends IEventSource<any>> =
  TSource extends IEventSource<infer TEvents> ? TEvents : never

type ConcatEvents<
  TBase extends EventMap,
  TAdd extends EventMap,
> = ConcatInterfaces<TBase, TAdd>

type ConcatInterfaces<
  TBase extends object,
  TAdd extends Omit<object, keyof TBase>,
> = {
  [K in keyof TBase | keyof TAdd]: K extends keyof TBase ? TBase[K]
  : K extends keyof TAdd ? TAdd[K]
  : never
}

type KeysOfTuple<TEvents extends readonly EventMap[]> = keyof TEvents[number]

type EventFromTuple<
  TEvents extends readonly EventMap[],
  K extends PropertyKey,
> =
  TEvents extends (
    readonly [infer TFirst extends EventMap, ...infer TRest extends EventMap[]]
  ) ?
    K extends keyof TFirst ?
      TFirst[K]
    : EventFromTuple<TRest, K>
  : never

type MergeEventTuple<TEvents extends EventMap[]> =
  TEvents extends (
    readonly [infer TFirst extends EventMap, ...infer TRest extends EventMap[]]
  ) ?
    ConcatEvents<TFirst, MergeEventTuple<TRest>>
  : EventMap

export type {
  ConcatEvents,
  ConcatInterfaces,
  EventFromTuple,
  EventsOf,
  KeysOfTuple,
  MergeEventTuple,
}
