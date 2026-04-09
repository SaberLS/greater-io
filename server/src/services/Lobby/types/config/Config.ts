type Statefull<T extends object, TState> = T & { get state(): TState }

export type { Statefull }
