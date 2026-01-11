import 'expect'

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toBeOk(): void
    }
    interface Matchers<R> {
      toBeOk(): R
    }
  }
}
