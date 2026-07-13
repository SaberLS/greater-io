import type { ZodType } from 'zod'
import type {
  OperationArgument,
  OperationResult,
  OperationTarget,
} from '../OperationData/OperationData'
import type { IOperation, IOperationSteps } from './IOperation'

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
    return this.executeSafe(target, this._schema.parse(input))
  }

  executeSafe(target: Target, argument: TArgument): TResult {
    this._steps.validate?.(target, argument)

    const result = this._steps.perform(target, argument)
    this._steps.handleResult?.(target, result)

    return result
  }
}

export { Operation }
