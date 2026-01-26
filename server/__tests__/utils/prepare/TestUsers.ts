import type { ICredentials } from '../../types/ICredentials'
import { TestUser } from './TestUser'

type ValidUser = keyof TestUsers['credentials']['valid']
type InvalidUser = keyof TestUsers['credentials']['invalid']

class TestUsers {
  url: string
  credentials: Record<'valid' | 'invalid', Record<string, ICredentials>> = {
    valid: {
      alice: { username: 'alice', password: 'secret' },
      patryk: { username: 'patryk', password: 'secret' },
    },
    invalid: {
      'non-existing': {
        username: 'non-existing-user',
        password: 'non-existing-passowrd',
      },
      'wrong-password': { username: 'patryk', password: 'wrong-password' },
      empty: { username: '', password: '' },
    },
  }

  constructor(url: string) {
    this.url = url
  }

  getUser(username: ValidUser) {
    return new TestUser(this.url, this.credentials.valid[username])
  }

  async getLoggedUser(...args: Parameters<typeof this.getUser>) {
    const user = this.getUser(...args)

    await user.login()
    return user
  }

  getInvalidUser(username: InvalidUser) {
    return new TestUser(this.url, this.credentials.invalid[username])
  }
}

export { TestUsers }
