import { EventSource } from '../../src'

interface TestEvents {
  message: {
    text: string
  }
}

class TestSource extends EventSource<TestEvents> {
  send(text: string): void {
    this.emit('message', { text })
  }
}

describe('EventSource', () => {
  let source: TestSource

  beforeEach(() => {
    source = new TestSource()
  })

  describe('emit', () => {
    it('should inject target into emitted event', () => {
      const handler = jest.fn()

      source.on('message', handler)

      source.send('hello')

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith({
        text: 'hello',
        target: source,
      })
    })

    it('should use the source instance as target', () => {
      let receivedTarget: unknown

      source.on('message', event => {
        receivedTarget = event.target
      })

      source.send('hello')

      expect(receivedTarget).toBe(source)
    })

    it('should preserve existing event properties', () => {
      const handler = jest.fn()

      source.on('message', handler)

      source.send('hello')

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'hello',
        })
      )
    })
  })

  describe('on/off', () => {
    it('should register and remove listeners', () => {
      const handler = jest.fn()

      source.on('message', handler)
      source.off('message', handler)

      source.send('hello')

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('once', () => {
    it('should invoke listener only once', () => {
      const handler = jest.fn()

      source.once('message', handler)

      source.send('first')
      source.send('second')

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith({
        text: 'first',
        target: source,
      })
    })
  })

  describe('dispose', () => {
    it('should remove all listeners', () => {
      const handler = jest.fn()

      source.on('message', handler)

      source.dispose()

      source.send('hello')

      expect(handler).not.toHaveBeenCalled()
    })
  })

  it('should inject target into emitted events', () => {
    const handler = jest.fn()

    source.on('message', handler)

    source.send('hello')

    expect(handler).toHaveBeenCalledWith({
      text: 'hello',
      target: source,
    })
  })
})
