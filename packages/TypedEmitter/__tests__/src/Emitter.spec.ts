import { Emitter } from '../../src'

interface TestEvents {
  message: { text: string }
  joined: { id: string }
}

describe('Emitter', () => {
  let emitter: Emitter<TestEvents>

  beforeEach(() => {
    emitter = new Emitter<TestEvents>()
  })

  describe('on + emit', () => {
    it('should call a registered listener', () => {
      const handler = jest.fn()

      emitter.on('message', handler)

      emitter.emit('message', { text: 'hello' })

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith({ text: 'hello' })
    })

    it('should call all listeners for an event', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      emitter.on('message', handler1)
      emitter.on('message', handler2)

      emitter.emit('message', { text: 'hello' })

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('should not throw when emitting event without listeners', () => {
      expect(() => {
        emitter.emit('message', { text: 'hello' })
      }).not.toThrow()
    })
  })

  describe('off', () => {
    it('should remove a listener', () => {
      const handler = jest.fn()

      emitter.on('message', handler)
      emitter.off('message', handler)

      emitter.emit('message', { text: 'hello' })

      expect(handler).not.toHaveBeenCalled()
    })

    it('should not affect other listeners', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      emitter.on('message', handler1)
      emitter.on('message', handler2)

      emitter.off('message', handler1)

      emitter.emit('message', { text: 'hello' })

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('should not throw when removing unregistered listener', () => {
      const handler = jest.fn()

      expect(() => {
        emitter.off('message', handler)
      }).not.toThrow()
    })
  })

  describe('once', () => {
    it('should call listener only once', () => {
      const handler = jest.fn()

      emitter.once('message', handler)

      emitter.emit('message', { text: 'first' })
      emitter.emit('message', { text: 'second' })

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith({ text: 'first' })
    })
  })

  describe('dispose', () => {
    it('should remove all listeners', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      emitter.on('message', handler1)
      emitter.on('joined', handler2)

      emitter.dispose()

      emitter.emit('message', { text: 'hello' })
      emitter.emit('joined', { id: '123' })

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
    })
  })

  it('should handle listener removing itself during emit', () => {
    const handler1 = jest.fn(() => {
      emitter.off('message', handler1)
    })

    const handler2 = jest.fn()

    emitter.on('message', handler1)
    emitter.on('message', handler2)

    emitter.emit('message', { text: 'hello' })

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
  })
})
