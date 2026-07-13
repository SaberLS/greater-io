import type { OperationMap, OperationSet } from '../OperationData/OperationData'
import type { IOperatable } from './IOperatable'

abstract class Operatable<
  TOperations extends OperationMap,
> implements IOperatable<TOperations> {
  protected abstract _operations: OperationSet<this, TOperations>

  dispatch<TOperation extends keyof TOperations>(
    key: TOperation,
    argument: TOperations[TOperation]['argument']
  ): TOperations[TOperation]['result'] {
    if (!(key in this._operations)) throw new Error('Invalid operation')

    return this._operations[key].execute(this, argument)
  }

  get operations(): readonly (keyof TOperations)[] {
    return Object.keys(this._operations) as (keyof TOperations)[]
  }
}

export { Operatable }
