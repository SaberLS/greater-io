import type { ZodType } from 'zod'
import type { IOperation } from '../Operation/IOperation'

type OperationArgument = object
type OperationResult = unknown
type OperationTarget = object

interface IOperationData<
  TArgument extends OperationArgument = OperationArgument,
  TResult extends OperationResult = OperationResult,
> {
  argument: TArgument
  result: TResult
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface OperationMap {
  readonly [Key: string]: IOperationData<OperationArgument, OperationResult>
}

type OperationSet<
  Target extends OperationTarget,
  TOperationMap extends OperationMap,
> = {
  [K in keyof TOperationMap]: IOperation<
    Target,
    TOperationMap[K]['argument'],
    TOperationMap[K]['result']
  >
}

type OperationSchemas<TOperations extends OperationMap> = {
  [K in keyof TOperations]: ZodType<TOperations[K]['argument']>
}

export type {
  IOperationData,
  OperationArgument,
  OperationMap,
  OperationResult,
  OperationSchemas,
  OperationSet,
  OperationTarget,
}
