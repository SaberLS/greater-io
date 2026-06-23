import { TypedMap } from '@greater-io/packages/typed-map'
import type { EmitArgs, EventMap, Handler, TypedEmitter } from './types'

class Emitter<TEvents extends EventMap> implements TypedEmitter<TEvents> {
  _listeners = new TypedMap<{
    [K in keyof TEvents]?: Set<Handler<TEvents, K>> | undefined
  }>({})

  get listeners(): TypedMap<{
    [K in keyof TEvents]?: Set<Handler<TEvents, K>> | undefined
  }> {
    return this._listeners
  }

  dispose(): void {
    this._listeners = new TypedMap<{
      [K in keyof TEvents]?: Set<Handler<TEvents, K>> | undefined
    }>({})
  }

  emit<K extends keyof TEvents>(
    event: K,
    eventObject: EmitArgs<TEvents, K>
  ): void {
    const listeners = this._listeners.get(event)
    if (!listeners) return

    // eslint-disable-next-line unicorn/no-useless-spread
    for (const fn of [...listeners]) fn(eventObject)
  }

  on<K extends keyof TEvents>(event: K, handler: Handler<TEvents, K>): void {
    const handlers = this._listeners.get(event)

    if (handlers === undefined)
      this._listeners.set(event, new Set<Handler<TEvents, K>>().add(handler))
    else handlers.add(handler)
  }

  off<K extends keyof TEvents>(event: K, handler: Handler<TEvents, K>): void {
    const handlers = this._listeners.get(event)
    if (!handlers) return

    handlers.delete(handler)
  }

  once<K extends keyof TEvents>(event: K, handler: Handler<TEvents, K>): void {
    const wrapper = (eventObject: EmitArgs<TEvents, K>): void => {
      this.off(event, wrapper)
      handler(eventObject)
    }

    this.on(event, wrapper)
  }
}

export { Emitter }
