import type {
  OperationArgument,
  OperationResult,
  OperationTarget,
} from '../OperationData/OperationData'

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

export type { IOperation, IOperationSteps }
