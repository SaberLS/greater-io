import { z } from 'zod'
import { Operation } from '../../src'

describe('Operation', () => {
  interface Target {
    value: number
  }

  interface Argument {
    amount: number
  }

  interface Result {
    total: number
  }

  const schema = z.object({
    amount: z.number(),
  })

  let target: Target

  beforeEach(() => {
    target = {
      value: 10,
    }
  })

  it('executes perform and returns its result', () => {
    const perform = jest.fn<Result, [Target, Argument]>((target, argument) => ({
      total: target.value + argument.amount,
    }))

    const operation = new Operation(
      {
        perform,
      },
      schema
    )

    const result = operation.executeSafe(target, {
      amount: 5,
    })

    expect(result).toEqual({
      total: 15,
    })

    expect(perform).toHaveBeenCalledTimes(1)
    expect(perform).toHaveBeenCalledWith(target, {
      amount: 5,
    })
  })

  it('calls validate before perform', () => {
    const calls: string[] = []

    const operation = new Operation(
      {
        validate: () => {
          calls.push('validate')
        },

        perform: () => {
          calls.push('perform')

          return {
            total: 123,
          }
        },
      },
      schema
    )

    operation.executeSafe(target, {
      amount: 5,
    })

    expect(calls).toEqual(['validate', 'perform'])
  })

  it('calls handleResult after perform', () => {
    const calls: string[] = []

    const operation = new Operation(
      {
        perform: () => {
          calls.push('perform')

          return {
            total: 100,
          }
        },

        handleResult: () => {
          calls.push('handle')
        },
      },
      schema
    )

    operation.executeSafe(target, {
      amount: 5,
    })

    expect(calls).toEqual(['perform', 'handle'])
  })

  it('passes perform result to handleResult', () => {
    const handleResult = jest.fn()

    const operation = new Operation(
      {
        perform: () => ({
          total: 999,
        }),

        handleResult,
      },
      schema
    )

    operation.executeSafe(target, {
      amount: 5,
    })

    expect(handleResult).toHaveBeenCalledWith(target, {
      total: 999,
    })
  })

  it('does not require validate', () => {
    const operation = new Operation(
      {
        perform: () => ({
          total: 1,
        }),
      },
      schema
    )

    expect(() =>
      operation.executeSafe(target, {
        amount: 5,
      })
    ).not.toThrow()
  })

  it('does not require handleResult', () => {
    const operation = new Operation(
      {
        perform: () => ({
          total: 1,
        }),
      },
      schema
    )

    expect(() =>
      operation.executeSafe(target, {
        amount: 5,
      })
    ).not.toThrow()
  })

  it('execute parses input using schema', () => {
    const perform = jest.fn(() => ({
      total: 15,
    }))

    const operation = new Operation(
      {
        perform,
      },
      schema
    )

    operation.execute(target, {
      amount: 5,
    })

    expect(perform).toHaveBeenCalledWith(target, {
      amount: 5,
    })
  })

  it('execute throws when schema validation fails', () => {
    const operation = new Operation(
      {
        perform: () => ({
          total: 0,
        }),
      },
      schema
    )

    expect(() =>
      operation.execute(target, {
        amount: 'wrong',
      })
    ).toThrow()
  })

  it('propagates validation errors', () => {
    const operation = new Operation(
      {
        validate: () => {
          throw new Error('Validation failed')
        },

        perform: () => ({
          total: 0,
        }),
      },
      schema
    )

    expect(() =>
      operation.executeSafe(target, {
        amount: 5,
      })
    ).toThrow('Validation failed')
  })
})
