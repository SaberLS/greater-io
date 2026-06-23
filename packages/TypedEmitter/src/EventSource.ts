import { Emitter } from './Emitter'
import type { AppendTarget, EmitArgs, EventMap, IEventSource } from './types'

class EventSource<TEvents extends EventMap> implements IEventSource<TEvents> {
  protected readonly _event = new Emitter<AppendTarget<TEvents, this>>()

  on: Emitter<AppendTarget<TEvents, typeof this>>['on'] = this._event.on.bind(
    this._event
  )
  once: Emitter<AppendTarget<TEvents, this>>['once'] = this._event.once.bind(
    this._event
  )
  off: Emitter<AppendTarget<TEvents, this>>['off'] = this._event.off.bind(
    this._event
  )
  dispose: Emitter<AppendTarget<TEvents, this>>['dispose'] =
    this._event.dispose.bind(this._event)

  emit<K extends keyof TEvents>(
    event: K,
    eventObject: EmitArgs<TEvents, K>
  ): void {
    this._event.emit(event, {
      ...eventObject,
      target: this,
    })
  }
}

export { EventSource }
