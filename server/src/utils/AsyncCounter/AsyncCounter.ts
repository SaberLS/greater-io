import { parseError } from '@greater-io/shared'
import type { TypedSignal } from './TypedController'

type ResolveReason = 'finished' | 'aborted'
interface Callbacks<TAbortReason> {
  onTick: () => void
  onAbort: (reason: TAbortReason) => void
  onStart: () => void
  onEnd: () => void
}

class AsyncCounter<TAbortReason> {
  #intervalId: ReturnType<typeof setInterval> | undefined
  #delay: number
  #limit: number
  #state = 0
  #done = false

  constructor(delay = 10_000, limit = 10) {
    this.#delay = delay
    this.#limit = limit
  }

  get isRunning(): boolean {
    return this.#intervalId !== undefined
  }

  #clear(): void {
    clearInterval(this.#intervalId)
    this.#intervalId = undefined
    this.#state = 0
  }

  #resolveOnce = (
    reason: ResolveReason,
    resolve: (value: ResolveReason | PromiseLike<ResolveReason>) => void
  ): void => {
    if (this.#done) return

    this.#done = true
    resolve(reason)
  }

  start(
    signal: TypedSignal<TAbortReason>,
    { onAbort, onTick, onStart, onEnd }: Partial<Callbacks<TAbortReason>>
  ): Promise<ResolveReason> {
    if (this.isRunning) {
      throw new Error('AsyncCounter is already running')
    }

    return new Promise<ResolveReason>((resolve, reject): void => {
      this.#done = false

      const cleanup = (): void => {
        this.#clear()
        signal.removeEventListener('abort', onSignalAbort)
      }

      const end = (): void => {
        cleanup()
        onEnd?.()
        this.#resolveOnce('finished', resolve)
      }

      const onSignalAbort = (): void => {
        onAbort?.(signal.reason)
        cleanup()
        this.#resolveOnce('aborted', resolve)
      }

      if (signal.aborted) return onSignalAbort()

      onStart?.()

      signal.addEventListener('abort', onSignalAbort)
      this.#intervalId = setInterval((): void => {
        try {
          if (signal.aborted) return onSignalAbort()

          onTick?.()
          this.#state++

          if (this.state >= this.limit) end()
        } catch (error) {
          cleanup()
          reject(parseError(error))
        }
      }, this.delay)
    })
  }

  get state(): number {
    return this.#state
  }

  get delay(): number {
    return this.#delay
  }

  get limit(): number {
    return this.#limit
  }
}

export { AsyncCounter }
export type { Callbacks, ResolveReason }
