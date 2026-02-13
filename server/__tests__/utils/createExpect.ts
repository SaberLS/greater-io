import type { IApiResponse } from '../../src/models'
import './matchers/toBeOk'
import './matchers/toBeSuccessful'
import './matchers/toHaveMessage'
import './matchers/toHaveStatus'
import type { SuperResponse } from './types'

type Messages<TCodes extends [200 | 201 | 204, ...number[]]> = Record<
  TCodes[number],
  string
>

function createExpectRes<TCodes extends [200 | 201 | 204, ...number[]]>(
  messages: Messages<TCodes>
) {
  type CodesUnion = TCodes[number]

  return <TData>(res: SuperResponse<IApiResponse<TData>>) => {
    const haveMessage = (status: CodesUnion) => {
      if (!(status in messages)) {
        throw new Error(`No message defined for status ${status}`)
      }

      expect(res).toHaveMessage(messages[status])
    }

    const success = (status: 200 | 201 | 204 = 200) => {
      expect(res).toBeOk()
      expect(res).toHaveStatus(status)
      expect(res).toBeSuccessful()

      return {
        and: {
          haveMessage: () => haveMessage(status),
        },
      }
    }

    const fail = (status: Exclude<CodesUnion, 200 | 201 | 204>) => {
      expect(res).not.toBeOk()
      expect(res).not.toBeSuccessful()
      expect(res).toHaveStatus(status)

      return {
        and: {
          haveMessage: () => haveMessage(status),
        },
      }
    }

    return {
      haveMessage,
      fail,
      success,
    }
  }
}

export { createExpectRes, type Messages }
