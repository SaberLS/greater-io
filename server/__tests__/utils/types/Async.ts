import type { RemoveNever } from '../../../src/utils'

type AsyncOrNever<T> =
  T extends (...args: unknown[]) => Promise<unknown> ? T : never

type AsyncMethods<TUser extends object> = RemoveNever<{
  [K in keyof TUser]: AsyncOrNever<TUser[K]>
}>

export type { AsyncMethods, AsyncOrNever }
