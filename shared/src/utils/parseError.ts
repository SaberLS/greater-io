const parseError = (error_: unknown) => {
  const error =
    error_ instanceof Error ? error_ : (
      new Error('Unknown Error', {
        cause: error_,
      })
    )
  return error
}

export { parseError }
