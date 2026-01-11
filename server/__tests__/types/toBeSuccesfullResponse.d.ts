import 'expect'

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toBeSuccefullResponse(): void
    }
    interface Matchers<R> {
      toBeSuccefullResponse(): R
    }
  }
}
