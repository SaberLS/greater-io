import type { OperationMap } from '../OperationData/OperationData'

interface IOperatable<TOperations extends OperationMap> {
  dispatch<TKey extends keyof TOperations>(
    key: TKey,
    argument: TOperations[TKey]['argument']
  ): TOperations[TKey]['result']

  get operations(): ReadonlySet<keyof TOperations>
}

export type { IOperatable }
