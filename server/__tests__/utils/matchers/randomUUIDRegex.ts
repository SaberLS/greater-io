import type { Definition } from '../../../src/services'

const randomUUIDRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const expectLobbyId = expect.stringMatching(
  randomUUIDRegex
) as Definition.LobbyID

export { expectLobbyId, randomUUIDRegex }
