import request from 'supertest'
import './matchers/toBeOk'
import './matchers/toBeSuccessful'
import './matchers/toHaveMessage'
import './matchers/toHaveStatus'

type Messages<TCodes extends [200 | 201 | 204, ...number[]]> = Record<
  TCodes[number],
  string
>

function createExpectRes<TCodes extends [200 | 201 | 204, ...number[]]>(
  messages: Messages<TCodes>
) {
  type CodesUnion = TCodes[number]

  return (res: request.Response) => {
    const e = {
      fail: (status: Exclude<CodesUnion, 200 | 201 | 204>) => {
        expect(res).not.toBeOk()
        expect(res).not.toBeSuccessful()
        expect(res).toHaveStatus(status)

        return {
          and: {
            haveMessage: () => e.haveMessage(status),
          },
        }
      },

      haveMessage: (status: CodesUnion) => {
        expect(res).toHaveMessage(messages[status])
      },

      success: (status: 200 | 201 | 204 = 200) => {
        expect(res).toBeOk()
        expect(res).toHaveStatus(status)
        expect(res).toBeSuccessful()

        return {
          and: {
            haveMessage: () => e.haveMessage(status),
          },
        }
      },
    }

    return e
  }
}

export { createExpectRes, type Messages }
