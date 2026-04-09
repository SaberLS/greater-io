class Emitter<TEvents extends EventMap> implements TypedEmitter<TEvents> {
  get listeners(): {
    [K in keyof TEvents]?: Handler<TEvents, K>[] | undefined
  } {
    return this.#listeners
  }

  dispose(): void {
    this.#listeners = {}
  }

  #listeners: {
    [K in keyof TEvents]?: Handler<TEvents, K>[]
  } = {}

  emit<K extends keyof TEvents>(
    event: K,
    eventObject: EmitArgs<TEvents, K>
  ): void {
    const listeners = this.#listeners[event]
    if (!listeners) return

    // use spread to make copy for safety, when event handler has this.off in function body, handler would perform operation on array which is we currently iterate over which is considered a unsafe operation
    // eslint-disable-next-line unicorn/no-useless-spread
    for (const fn of [...listeners]) {
      // ⚠️ cast needed (safe by design)
      fn(eventObject)
    }
  }

  on<K extends keyof TEvents>(event: K, handler: Handler<TEvents, K>): void {
    this.#listeners[event] ??= []
    this.#listeners[event].push(handler)
  }

  off<K extends keyof TEvents>(event: K, handler: Handler<TEvents, K>): void {
    const arr = this.#listeners[event]
    if (!arr) return

    const index = arr.indexOf(handler)
    if (index !== -1) arr.splice(index, 1)
  }

  once<K extends keyof TEvents>(event: K, handler: Handler<TEvents, K>): void {
    const wrapper = (eventObject: EmitArgs<TEvents, K>): void => {
      this.off(event, wrapper)
      handler(eventObject)
    }

    this.on(event, wrapper)
  }
}

class EventSource<TEvents extends EventMap, Target extends object> {
  protected readonly _event = new Emitter<AppendTarget<TEvents, Target>>()

  protected emit<K extends keyof TEvents>(
    event: K,
    eventObject: EmitArgs<TEvents, K>
  ): void {
    this._event.emit(event, {
      ...eventObject,
      target: this as unknown as Target,
    } as unknown as EmitArgs<AppendTarget<TEvents, Target>, K>)
  }

  get on(): Emitter<AppendTarget<TEvents, Target>>['on'] {
    return this._event.on.bind(this)
  }

  get once(): Emitter<AppendTarget<TEvents, Target>>['once'] {
    return this._event.once.bind(this)
  }

  get off(): Emitter<AppendTarget<TEvents, Target>>['off'] {
    return this._event.off.bind(this)
  }

  get dispose(): Emitter<AppendTarget<TEvents, Target>>['dispose'] {
    return this._event.dispose.bind(this)
  }
}

interface EventObject {
  readonly payload: object
}

type EventMap = Record<keyof object, EventObject | undefined>

interface TypedEmitter<TEvents extends EventMap> {
  on: EventHandler<TEvents>
  once: EventHandler<TEvents>
  off: EventHandler<TEvents>

  get listeners(): {
    [K in keyof TEvents]?: Handler<TEvents, K>[]
  }

  dispose(): void

  emit: Emit<TEvents>
}

interface Emitts<TEvents extends EventMap> {
  event: Emitter<TEvents>
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

type SourceOfEvents<
  TArget extends object,
  TEvents extends EventMap,
> = EventSource<TEvents, TArget> & TArget

type AppendTarget<TEvents extends EventMap, Target> = {
  readonly [K in keyof TEvents]: TEvents[K] & { readonly target: Target }
}

type SourceOfCtx<TCtx extends SourceCtx> = SourceOfEvents<
  TCtx['instance'],
  TCtx['events']
>

interface SourceCtx {
  readonly instance: object
  readonly events: EventMap
}

export { Emitter, EventSource }
export type {
  AppendTarget,
  Emitts,
  EventHandler,
  EventMap,
  Handler,
  SourceCtx,
  SourceOfCtx,
  SourceOfEvents,
  TypedEmitter,
}
