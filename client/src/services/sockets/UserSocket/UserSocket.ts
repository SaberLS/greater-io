import { Socket } from 'socket.io-client'

class UserSocket<TCreatorParams extends unknown[]> implements IUserSocket {
  protected _socket: Socket | undefined
  protected _connectingPromise: Promise<void> | undefined
  protected _createSocket: (...args: TCreatorParams) => Socket

  constructor(createSocket: (...args: TCreatorParams) => Socket) {
    this._createSocket = createSocket
  }

  async connect(...createArgs: TCreatorParams): Promise<void> {
    if (this._socket?.connected) return
    if (this._connectingPromise) return

    this._connectingPromise = new Promise<void>((resolve, reject) => {
      const socket = this._createSocket(...createArgs)

      socket.once('connect', () => {
        this._socket = socket
        this._connectingPromise = undefined
        resolve()
      })

      socket.once('connect_error', err => {
        this._connectingPromise = undefined
        reject(err)
      })
    })

    return this._connectingPromise
  }

  disconnect(): void {
    this._socket?.disconnect()
    this._socket = undefined
  }

  get isConnected(): boolean {
    return Boolean(this._socket?.connected)
  }

  get instance(): Socket {
    if (this._socket === undefined) throw new Error('Socket not defined')
    if (!this._socket.connected) throw new Error('Socket not connected')

    return this._socket
  }
}

interface IUserSocket {
  get instance(): Socket
  get isConnected(): boolean

  disconnect(): void
  connect(): Promise<void>
}

export { UserSocket }
export type { IUserSocket }
