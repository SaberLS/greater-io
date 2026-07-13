type OperationArgument = object
type OperationResult = unknown
type OperationTarget = object

interface IOperation<
  Target extends OperationTarget,
  TArgument extends OperationArgument,
  TResult extends OperationResult,
> {
  execute(target: Target, argument: unknown): TResult
  executeSafe(target: Target, argument: TArgument): TResult
}

interface IOperationSteps<
  Target extends OperationTarget,
  TArgument extends OperationArgument,
  TResult extends OperationResult,
> {
  validate?: (target: Target, argument: TArgument) => void
  perform: (target: Target, argument: TArgument) => TResult
  handleResult?: (target: Target, result: TResult) => void
}

class Operation<
  Target extends OperationTarget,
  TArgument extends OperationArgument,
  TResult extends OperationResult,
> implements IOperation<Target, TArgument, TResult> {
  protected readonly _steps: IOperationSteps<Target, TArgument, TResult>
  protected readonly _schema: ZodType<TArgument>

  constructor(
    steps: IOperationSteps<Target, TArgument, TResult>,
    schema: ZodType<TArgument>
  ) {
    this._steps = steps
    this._schema = schema
  }

  execute(target: Target, input: unknown): TResult {
    return this.execute(target, this._schema.parse(input))
  }

  executeSafe(target: Target, argument: TArgument): TResult {
    this._steps.validate?.(target, argument)

    const result = this._steps.perform(target, argument)
    this._steps.handleResult?.(target, result)

    return result
  }
}

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

interface IOperatable<TOperations extends OperationMap> {
  dispatch<TKey extends keyof TOperations>(
    key: TKey,
    argument: TOperations[TKey]['argument']
  ): TOperations[TKey]['result']

  get operations(): readonly (keyof TOperations)[]
}

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

export { Operatable, Operation }
export type {
  IOperatable,
  IOperation,
  IOperationSteps,
  OperationMap,
  OperationSchemas,
  OperationSet,
}
