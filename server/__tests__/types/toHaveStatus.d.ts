import 'expect'

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toHaveStatus(expectedStatus: number): void
    }
    interface Matchers<R> {
      toHaveStatus(expectedStatus: number): R
    }
  }
}
