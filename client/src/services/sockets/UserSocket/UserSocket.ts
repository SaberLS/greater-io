import { Socket } from 'socket.io-client'

class UserSocket<TCreatorParams extends unknown[]> {
  #socket: Socket | undefined
  protected _connectingPromise: Promise<Socket> | undefined
  protected _createSocket: (...args: TCreatorParams) => Socket

  constructor(createSocket: (...args: TCreatorParams) => Socket) {
    this._createSocket = createSocket
  }

  async connect(...createArgs: TCreatorParams): Promise<Socket> {
    if (this._connectingPromise) return this._connectingPromise
    if (this.#socket?.connected) return this.#socket

    this.#socket = await new Promise<Socket>((resolve, reject) => {
      const socket = this._createSocket(...createArgs)

      socket.once('connect', () => {
        this._connectingPromise = undefined
        socket.removeListener('connect_error', reject)
        resolve(socket)
      })

      socket.once('connect_error', () => {
        this._connectingPromise = undefined
        reject()
      })
    })

    return this.#socket
  }

  disconnect() {
    this.#socket?.disconnect()
    this.#socket = undefined
  }

  get socket(): Socket {
    if (this.#socket === undefined) throw new Error('Socket not defined')
    if (!this.#socket.connected) throw new Error('Socket not connected')

    return this.#socket
  }
}

export { UserSocket }
