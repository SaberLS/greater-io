/* eslint-disable @typescript-eslint/unbound-method */
import type { IOperation, OperationMap, OperationSet } from '../../src'
import { Operatable } from '../../src'

describe('Operatable', () => {
  interface TestOperations extends OperationMap {
    add: {
      argument: { value: number }
      result: number
    }

    multiply: {
      argument: { value: number }
      result: number
    }
  }

  class TestOperatable extends Operatable<TestOperations> {
    constructor(
      protected readonly _operations: OperationSet<
        Operatable<TestOperations>,
        TestOperations
      >
    ) {
      super()
    }

    value = 10
  }

  let addOperation: jest.Mocked<
    IOperation<TestOperatable, { value: number }, number>
  >

  let multiplyOperation: jest.Mocked<
    IOperation<TestOperatable, { value: number }, number>
  >

  let operatable: TestOperatable

  beforeEach(() => {
    addOperation = {
      execute: jest.fn().mockReturnValue(15),
      executeSafe: jest.fn(),
    }

    multiplyOperation = {
      execute: jest.fn().mockReturnValue(20),
      executeSafe: jest.fn(),
    }

    operatable = new TestOperatable({
      add: addOperation,
      multiply: multiplyOperation,
    })
  })

  it('dispatches the correct operation', () => {
    operatable.dispatch('add', {
      value: 5,
    })

    expect(addOperation.execute).toHaveBeenCalledTimes(1)
    expect(multiplyOperation.execute).not.toHaveBeenCalled()
  })

  it('passes itself as the operation target', () => {
    operatable.dispatch('add', {
      value: 5,
    })

    expect(addOperation.execute).toHaveBeenCalledWith(operatable, {
      value: 5,
    })
  })

  it('returns the operation result', () => {
    const result = operatable.dispatch('add', {
      value: 5,
    })

    expect(result).toBe(15)
  })

  it('throws when operation does not exist', () => {
    expect(() =>
      operatable.dispatch('unknown' as keyof TestOperations, {} as never)
    ).toThrow('Invalid operation')
  })

  it('returns all registered operations', () => {
    expect(operatable.operations).toEqual(['add', 'multiply'])
  })

  it('operations getter is readonly', () => {
    const operations = operatable.operations

    expect(operations).toEqual(['add', 'multiply'])

    expect(Array.isArray(operations)).toBe(true)
  })
})
