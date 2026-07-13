interface EventObject {
  readonly payload: object
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface EventMap {
  readonly [event: string]: EventObject | undefined
}

export type { EventMap, EventObject }
