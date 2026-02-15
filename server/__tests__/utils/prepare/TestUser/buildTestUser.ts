import type { IApiResponse, IApiSuccess } from '../../../../src/models'
import { isSupertestResponse } from '../../isSupertestResponse'
import type {
  AssertSuccessInRes,
  AsyncMethods,
  SuperResponse,
} from '../../types'
import type { TestUser } from './TestUser'

async function buildTestUser<
  TUser extends TestUser,
  TMethod extends keyof AsyncMethods<TUser>,
>(
  user: TUser,
  ...methods: TMethod[]
): Promise<ExecutedUserMethods<TUser, TMethod>> {
  const entries = await Promise.all(
    //@ts-expect-error this is impossible to type typescript loses link between key(TMethod) and user method TUser[TMethod]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    methods.map(async (method: TMethod) => [method, await user[method]()])
  )

  const result = {
    user,
    ...Object.fromEntries(entries),
  } as ExecutedUserMethods<TUser, TMethod>

  return result
}

const unpackResData = <
  TMethods extends keyof AsyncMethods<TUser>,
  TUser extends TestUser = TestUser,
  TRes extends ExecutedUserMethods<TUser, TMethods> = ExecutedUserMethods<
    TUser,
    TMethods
  >,
>(
  res: TRes
): InferDataFromSuperRes<AssertSuccessInRes<TRes>> => {
  const response = {} as InferDataFromSuperRes<AssertSuccessInRes<TRes>>

  for (const method in res as AssertSuccessInRes<TRes>) {
    if (isSupertestResponse(res[method]))
      if ((res[method].body as IApiResponse<unknown>).success)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        response[method] = res[method].body.data
      else
        throw new Error(`Method ${method} didn't succeed`, {
          cause: res[method],
        })
    // @ts-expect-error sssss
    else response[method] = res[method]
  }

  return response
}

type UserMethodsReturns<
  TUser extends TestUser,
  TMethods extends keyof AsyncMethods<TUser>,
> = {
  [K in TMethods]: TUser[K] extends () => Promise<unknown> ?
    Awaited<ReturnType<TUser[K]>>
  : never
}

type ExecutedUserMethods<
  TUser extends TestUser,
  TMethod extends keyof AsyncMethods<TUser>,
> = UserMethodsReturns<TUser, TMethod> & { user: TUser }

type InferDataFromSuperRes<T extends object> = {
  [K in keyof T]: T[K] extends SuperResponse<IApiSuccess<infer TData>> ?
    TData extends object ?
      TData
    : undefined
  : T[K]
}

type TestUserMethods<TMethods extends keyof AsyncMethods<TestUser>> =
  InferDataFromSuperRes<
    AssertSuccessInRes<ExecutedUserMethods<TestUser, TMethods>>
  >

// EXAMPLE
// const users = new TestUsers('s')

// const builded = unpackResData<'me' | 'protectedSocket'>(
//   await testUserExecutor(
//     await users.getLoggedUser('patryk'),
//     'health',
//     'me',
//     'protectedSocket'
//   )
// )

export { buildTestUser, unpackResData }
export type { ExecutedUserMethods, TestUserMethods, UserMethodsReturns }
