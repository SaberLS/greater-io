import { parseError } from '@greater-io/shared'
import type {
  GameState,
  LobbyState,
} from '../../../../../src/services/LobbyTypesDefinition'
import {
  buildTestServer,
  once,
  TestUsers,
  type TestUserMethods,
} from '../../../../utils'
import { expectLobbyId } from '../../../../utils/matchers/randomUUIDRegex'

function solveMathExpressions(expressions: string[]): number[] {
  return expressions.map(expr => {
    // Remove any accidental whitespace
    const cleanExpr = expr.replaceAll(/\s+/g, '')

    // Match the numbers and the operator
    // This regex looks for: (number) (operator) (number)
    const match = /^(\d+(?:\.\d+)?)([+\-*/])(\d+(?:\.\d+)?)$/.exec(cleanExpr)

    if (!match) {
      console.warn(`Invalid expression format: ${expr}`)
      return Number.NaN
    }

    const num1 = Number.parseFloat(match[1])
    const operator = match[2]
    const num2 = Number.parseFloat(match[3])

    switch (operator) {
      case '+': {
        return num1 + num2
      }
      case '-': {
        return num1 - num2
      }
      case '*': {
        return num1 * num2
      }
      case '/': {
        return num2 === 0 ? Infinity : num1 / num2
      }
      default: {
        return Number.NaN
      }
    }
  })
}

describe('Protected Socket Namespace lobby:start', () => {
  const server = buildTestServer()

  let lobbyState: LobbyState
  let owner: TestUserMethods<'protectedSocket' | 'me'>
  let member: TestUserMethods<'protectedSocket' | 'me'>

  let users: TestUsers

  let startAt: number
  let gameState: GameState

  beforeAll(async () => {
    await server.init()
    users = new TestUsers(server.url)

    await Promise.all([
      users.prepareLoggedUser('alice', 'me', 'protectedSocket'),
      users.prepareLoggedUser('patryk', 'me', 'protectedSocket'),
    ])
      .then(users.unpackDataArr)
      .then(([ow, mem]) => {
        owner = ow
        member = mem
      })

    owner.protectedSocket.emit('lobby:create')
    lobbyState = await once<LobbyState>(owner.protectedSocket, 'lobby:state')

    member.protectedSocket.emit('lobby:join', lobbyState.id)
    lobbyState = await once<LobbyState>(member.protectedSocket, 'lobby:state')
  })

  afterAll(async () => {
    await server.close()

    for (const usr of [owner, member]) usr.protectedSocket.disconnect()
  })

  it('should reject when user is not an lobby owner', async () => {
    member.protectedSocket.emit('lobby:start')
    const error = await once<string>(member.protectedSocket, 'lobby:error')

    expect(error).toEqual(`User is not a lobby owner`)
  })

  it('should reject when all users are not ready', async () => {
    owner.protectedSocket.emit('lobby:start')
    const error = await once<string>(owner.protectedSocket, 'lobby:error')

    expect(error).toEqual(`Not all lobby members are ready`)
  })

  it('should reject when not all users are ready', async () => {
    owner.protectedSocket.emit('lobby:status', 'ready')
    owner.protectedSocket.emit('lobby:start')
    const error = await once<string>(owner.protectedSocket, 'lobby:error')

    expect(error).toEqual(`Not all lobby members are ready`)
  })

  it('should create a game and change lobby status', async () => {
    member.protectedSocket.emit('lobby:status', 'ready')
    lobbyState = await once<LobbyState>(member.protectedSocket, 'lobby:state')

    console.log(lobbyState)

    // const events: (number | string)[] = []
    // const expectedEvents = ['start', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'end']

    owner.protectedSocket.on('lobby:error', (e: unknown) => {
      throw parseError(e)
    })
    lobbyState = await once<LobbyState>(member.protectedSocket, 'lobby:state')

    // start lobby
    const promise = Promise.all([
      once<{ startAt: number }>(member.protectedSocket, 'lobby:game-scheduled'),
      once<GameState>(member.protectedSocket, 'lobby:game-state'),
    ])

    owner.protectedSocket.emit('lobby:start')

    lobbyState = await once<LobbyState>(member.protectedSocket, 'lobby:state')

    expect(lobbyState).toEqual({
      id: expectLobbyId,
      ownerId: owner.me.id,
      status: 'creating-game',
      maxMembers: 4,
      currentMemberCount: 2,
      members: {
        [owner.me.id]: {
          user: { id: owner.me.id, username: owner.me.username },
          status: 'ready',
        },
        [member.me.id]: {
          user: { id: member.me.id, username: member.me.username },
          status: 'ready',
        },
      },
    } satisfies LobbyState)

    const [start, gameState] = await promise
    startAt = start.startAt
    expect(startAt).toBeGreaterThan(0)

    expect(gameState).toEqual({
      leaderboard: [owner.me.id, member.me.id],
      status: 'scheduled',
      questions: expect.arrayContaining([expect.any(String)]) as string[],
      players: {
        [owner.me.id]: {
          score: {},
          status: 'ready',
          user: {
            id: owner.me.id,
            username: owner.me.username,
          },
        },
        [member.me.id]: {
          score: {},
          status: 'ready',
          user: {
            id: member.me.id,
            username: member.me.username,
          },
        },
      },
    } satisfies GameState)
  })

  it('should start the game at set time', async () => {
    gameState = await once<GameState>(
      member.protectedSocket,
      'lobby:game-state'
    )

    const startedAfter = Date.now() - startAt

    expect(startedAfter).toBeGreaterThanOrEqual(0)
    expect(startedAfter).toBeLessThanOrEqual(1000)
  })

  it('should send the game state at start', () => {
    expect(gameState).toEqual({
      leaderboard: [owner.me.id, member.me.id],
      status: 'in-progress',
      questions: expect.arrayContaining([expect.any(String)]) as string[],
      players: {
        [owner.me.id]: {
          score: {},
          status: 'in-game',
          user: {
            id: owner.me.id,
            username: owner.me.username,
          },
        },
        [member.me.id]: {
          score: {},
          status: 'in-game',
          user: {
            id: member.me.id,
            username: member.me.username,
          },
        },
      },
    } satisfies GameState)
  })

  it('should response with answer_score after correct answer', async () => {
    const correctAnswers = solveMathExpressions(gameState.questions)

    member.protectedSocket.emit('lobby:game:submit-answer', {
      index: 0,
      answer: String(correctAnswers[0]),
    })

    interface AnswerResponse {
      answer_score: {
        correct: true
        time: number
      }
      playerId: number
    }

    const [response, state] = await Promise.all([
      once<AnswerResponse>(owner.protectedSocket, 'lobby:game-answer'),
      once<GameState>(member.protectedSocket, 'lobby:game-state'),
    ])

    expect(response).toEqual({
      answer_score: {
        correct: true,
        time: expect.any(Number) as number,
      },
      playerId: member.me.id,
    })

    gameState = state
  })

  it('should end game after recieving all correct answers from one of the users', async () => {
    //
    const correctAnswers = solveMathExpressions(gameState.questions)

    for (const [index, answer] of Object.entries(correctAnswers)) {
      member.protectedSocket.emit('lobby:game:submit-answer', {
        index,
        answer: answer.toString(),
      })
      gameState = await once<GameState>(
        owner.protectedSocket,
        'lobby:game-state'
      )
    }

    expect(gameState).toEqual({
      leaderboard: [member.me.id, owner.me.id],
      status: 'finished',
      questions: expect.arrayContaining([expect.any(String)]) as string[],
      players: {
        [owner.me.id]: {
          score: {},
          status: 'in-game',
          user: {
            id: owner.me.id,
            username: owner.me.username,
          },
        },
        [member.me.id]: {
          score: Object.fromEntries(
            correctAnswers.map((q, index) => [
              index,
              { correct: true, time: expect.any(Number) as number },
            ])
          ),
          status: 'in-game',
          user: {
            id: member.me.id,
            username: member.me.username,
          },
        },
      },
    } satisfies GameState)
  })
})
