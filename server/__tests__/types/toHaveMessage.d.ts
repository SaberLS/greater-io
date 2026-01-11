import 'expect'

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toHaveMessage(expectedMessage: string): void
    }
    interface Matchers<R> {
      toHaveMessage(expectedMessage: string): R
    }
  }
}
