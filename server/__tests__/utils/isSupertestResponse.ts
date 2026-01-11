import request from 'supertest'

const isSupertestResponse = (obj: unknown): obj is request.Response => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'status' in obj &&
    'ok' in obj &&
    'headers' in obj &&
    'body' in obj
  )
}

export { isSupertestResponse }
