import 'expect'

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toBeSuccessful(): void
    }
    interface Matchers<R> {
      toBeSuccessful(): R
    }
  }
}
