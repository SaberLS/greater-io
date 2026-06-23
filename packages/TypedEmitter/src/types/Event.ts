interface EventObject {
  readonly payload: object
}

type EventMap = Record<keyof object, EventObject | undefined>

export type { EventMap, EventObject }
