import 'expect'

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toBeSuccesfull(): void
    }
    interface Matchers<R> {
      toBeSuccesfull(): R
    }
  }
}
