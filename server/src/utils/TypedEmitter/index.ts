class Emitter<TEvents extends object> implements TypedEmitter<TEvents> {
  dispose(): void {
    throw new Error('Method not implemented.')
  }
  #listeners: {
    [K in keyof TEvents]?: Handler<TEvents[K]>[]
  } = {}

  emit<K extends keyof TEvents>(
    event: K,
    ...args: PayloadArgs<TEvents[K]>
  ): void {
    const listeners = this.#listeners[event]
    if (!listeners) return

    // use spread to make copy for safety, when event handler has this.off in function body, handler would perform operation on array which is we currently iterate over which is considered a unsafe operation
    // eslint-disable-next-line unicorn/no-useless-spread
    for (const fn of [...listeners]) fn(...args)
  }

  on<K extends keyof TEvents>(event: K, handler: Handler<TEvents[K]>): void {
    this.#listeners[event] ??= []
    this.#listeners[event]!.push(handler)
  }

  off<K extends keyof TEvents>(event: K, handler: Handler<TEvents[K]>): void {
    const arr = this.#listeners[event]
    if (!arr) return
    this.#listeners[event] = arr.filter((fn): boolean => fn !== handler)
  }

  once<K extends keyof TEvents>(event: K, handler: Handler<TEvents[K]>): void {
    const wrapper = (...args: PayloadArgs<TEvents[K]>): void => {
      this.off(event, wrapper)
      handler(...args)
    }

    this.on(event, wrapper)
  }
}

interface TypedEmitter<TEvents extends object> {
  on: EventHandler<TEvents>
  once: EventHandler<TEvents>
  off: EventHandler<TEvents>

  dispose(): void

  emit: Emit<TEvents>
}

interface Emitts<TEvents extends object> {
  event: TypedEmitter<TEvents>
}

type Emit<TEvents extends object> = <K extends keyof TEvents>(
  event: K,
  ...args: PayloadArgs<TEvents[K]>
) => void

type EventHandler<TEvents extends object> = <K extends keyof TEvents>(
  event: K,
  handler: Handler<TEvents[K]>
) => void

type Handler<TPayload> = (...args: PayloadArgs<TPayload>) => void

type PayloadArgs<TPayload> = TPayload extends void ? [] : [payload: TPayload]

export { Emitter }
export type { Emitts, TypedEmitter }
