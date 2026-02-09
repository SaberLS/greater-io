interface TypedSignal<TAbortReason> extends AbortSignal {
  reason: TAbortReason
}

interface TypedController<TS> extends AbortController {
  signal: TypedSignal<TS>
}

const createAbortController = <T>() => {
  return new AbortController() as TypedController<T>
}

export { createAbortController }
export type { TypedController, TypedSignal }
