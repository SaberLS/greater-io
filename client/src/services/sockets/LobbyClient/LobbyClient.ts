import { protectedSocket } from '../protectedSocket'

type LobbyState = {
  id: `${string}-${string}-${string}-${string}-${string}`
  ownerId: number
  status: 'open' | 'closed' | 'game-in-progress' | 'creating-game'
  maxMembers: number
  currentMemberCount: number
  members: Record<
    number,
    {
      user: {
        id: number
        username: string
      }
      status: 'ready' | 'in-game' | 'not-ready'
    }
  >
}

interface AnswerScore {
  correct: boolean
  time: number
}

type GameState = {
  leaderboard: number[]
  status: 'scheduled' | 'in-progress' | 'finished'
  questions: string[]
  players: {
    score: Record<number, AnswerScore>
    status: 'ready' | 'in-game'
    user: {
      id: number
      username: string
    }
  }[]
}

type ScheduledGameState = {
  startAt: number
  state: GameState
}

interface Snapshot {
  lobbyState?: LobbyState
  gameState?: GameState
  startAt?: number
}

// TODO: paths like lobby:create/join should use ack to make use cleaner, it could allow to remove waitForLobbyState
class LobbyClient {
  lobbyState?: Snapshot['lobbyState']
  gameState?: Snapshot['gameState']
  startAt?: Snapshot['startAt']

  listeners = new Set<() => void>()

  private snapshot: Snapshot = {
    lobbyState: undefined,
    gameState: undefined,
    startAt: undefined,
  }

  getSnapshot = () => {
    return this.snapshot
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => void this.listeners.delete(fn)
  }

  notify() {
    for (const fn of this.listeners) fn()
  }

  private updateSnapshot() {
    this.snapshot = {
      lobbyState: this.lobbyState,
      gameState: this.gameState,
      startAt: this.startAt,
    }

    this.notify()
  }

  connectListeners() {
    const socket = protectedSocket.instance

    socket.on('lobby:state', state => {
      this.lobbyState = state
      this.updateSnapshot()
    })

    socket.on('lobby:game-state', state => {
      this.gameState = state
      this.updateSnapshot()
    })

    socket.on('lobby:game-scheduled', (data: ScheduledGameState) => {
      this.startAt = data.startAt
      this.updateSnapshot()
    })

    // socket.on('lobby:game-started', () => {})

    // socket.on(
    //   'lobby:game-answer',
    //   ({
    //     answer_score: score,
    //     playerId,
    //   }: {
    //     answer_score: AnswerScore
    //     playerId: number
    //   }) => {

    //   }
    // )

    // socket.on('lobby:game-ended', () => {
    // })
  }

  createLobby() {
    protectedSocket.instance.emit('lobby:create')
  }

  joinLobby(id: LobbyState['id']) {
    protectedSocket.instance.emit('lobby:join', id)
  }

  setStatus(status: 'ready' | 'not-ready') {
    protectedSocket.instance.emit('lobby:status', status)
  }

  startLobby() {
    protectedSocket.instance.emit('lobby:start')
  }

  submitAnswer(index: number, answer: string) {
    protectedSocket.instance.emit('lobby:game:submit-answer', {
      index,
      answer,
    })
  }

  private waitForLobbyState(): Promise<LobbyState> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('Lobby state timed out')),
        5000
      )

      const handler = (state: LobbyState) => {
        clearTimeout(timer)
        protectedSocket.instance?.off('lobby:state', handler)
        resolve(state)
      }
      protectedSocket.instance?.on('lobby:state', handler)
    })
  }

  async createLobbyAndWait(): Promise<LobbyState> {
    this.createLobby()
    return this.waitForLobbyState()
  }

  async joinLobbyAndWait(id: LobbyState['id']): Promise<LobbyState> {
    this.joinLobby(id)
    return this.waitForLobbyState()
  }
}

export const lobbyClient = new LobbyClient()
export type { GameState, LobbyState, Snapshot }
