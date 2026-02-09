import { AsyncCounter } from '../../../src/utils'
import { createAbortController } from '../../../src/utils/AsyncCounter'

describe('util counter', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should finish after reaching the limit', async () => {
    const counter = new AsyncCounter(1000, 3)
    const controller = createAbortController<string>()

    const onTick = jest.fn()
    const onStart = jest.fn()
    const onEnd = jest.fn()

    const promise = counter.start(controller.signal, {
      onTick,
      onStart,
      onEnd,
    })

    expect(counter.isRunning).toBe(true)
    expect(onStart).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(3000)

    await expect(promise).resolves.toBe('finished')

    expect(onTick).toHaveBeenCalledTimes(3)
    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(counter.isRunning).toBe(false)
  })

  it('should abort when signal is aborted', async () => {
    const counter = new AsyncCounter(1000, 10)
    const controller = createAbortController<string>()

    const onAbort = jest.fn()
    const onTick = jest.fn()

    const promise = counter.start(controller.signal, {
      onAbort,
      onTick,
    })

    jest.advanceTimersByTime(2000) // 2 ticks

    controller.abort('user-disconnected')

    jest.runOnlyPendingTimers()

    await expect(promise).resolves.toBe('aborted')

    expect(onTick).toHaveBeenCalledTimes(2)
    expect(onAbort).toHaveBeenCalledWith('user-disconnected')
    expect(counter.isRunning).toBe(false)
  })

  it('should abort immediately if signal is already aborted', async () => {
    const counter = new AsyncCounter(1000, 3)
    const controller = createAbortController<string>()

    controller.abort('already-aborted')

    const onStart = jest.fn()
    const onAbort = jest.fn()

    const promise = counter.start(controller.signal, {
      onStart,
      onAbort,
    })

    await expect(promise).resolves.toBe('aborted')

    expect(onStart).not.toHaveBeenCalled()
    expect(onAbort).toHaveBeenCalledWith('already-aborted')
    expect(counter.isRunning).toBe(false)
  })

  it('should throw if start is called while already running', () => {
    const counter = new AsyncCounter(1000, 3)
    const controller = createAbortController<void>()

    void counter.start(controller.signal, {})

    expect(() => counter.start(controller.signal, {})).toThrow(
      'AsyncCounter is already running'
    )
  })

  it('should not tick after abort', async () => {
    const counter = new AsyncCounter(1000, 10)
    const controller = createAbortController<void>()

    const onTick = jest.fn()

    const promise = counter.start(controller.signal, { onTick })

    jest.advanceTimersByTime(3000) // 3 ticks
    controller.abort()

    jest.advanceTimersByTime(5000)

    await promise

    expect(onTick).toHaveBeenCalledTimes(3)
  })
})
