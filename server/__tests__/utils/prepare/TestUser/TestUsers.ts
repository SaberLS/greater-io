import type { AsyncMethods } from '../../types'
import {
  buildTestUser,
  unpackResData,
  type ExecutedUserMethods,
} from './buildTestUser'
import { TestUser } from './TestUser'

type ValidUser = keyof (typeof TestUsers)['valid']
type InvalidUser = keyof (typeof TestUsers)['invalid']

class TestUsers {
  url: string
  static readonly invalid = Object.seal({
    'non-existing': {
      username: 'non-existing-user',
      password: 'non-existing-passowrd',
    },
    'wrong-password': { username: 'patryk', password: 'wrong-password' },
    empty: { username: '', password: '' },
  })

  static readonly valid = Object.seal({
    alice: { username: 'alice', password: 'secret' },
    patryk: { username: 'patryk', password: 'secret' },
  })

  static readonly credentials = Object.seal({
    ...TestUsers.invalid,
    ...TestUsers.valid,
  })

  constructor(url: string) {
    this.url = url
  }

  getUser(username: ValidUser | InvalidUser) {
    return new TestUser(this.url, TestUsers.credentials[username])
  }

  async getLoggedUser(...args: Parameters<typeof this.getUser>) {
    const user = this.getUser(...args)

    await user.login()
    return user
  }

  getInvalidUser(username: InvalidUser) {
    return new TestUser(this.url, TestUsers.invalid[username])
  }

  prepareUser = <TMethods extends keyof AsyncMethods<TestUser>>(
    username: ValidUser | InvalidUser,
    ...methods: TMethods[]
  ) => buildTestUser<TestUser, TMethods>(this.getUser(username), ...methods)

  prepareLoggedUser = <TMethods extends keyof AsyncMethods<TestUser>>(
    username: ValidUser,
    ...methods: TMethods[]
  ) =>
    this.getLoggedUser(username).then(usr =>
      buildTestUser<TestUser, TMethods>(usr, ...methods)
    )

  unpackData = <TMethods extends keyof AsyncMethods<TestUser>>(
    data: ExecutedUserMethods<TestUser, TMethods>
  ) => unpackResData<TMethods, TestUser>(data)

  unpackDataArr = <TMethods extends keyof AsyncMethods<TestUser>>(
    data: ExecutedUserMethods<TestUser, TMethods>[]
  ) => data.map(d => unpackResData<TMethods, TestUser>(d))
}
export { TestUsers }
export type { InvalidUser, ValidUser }
