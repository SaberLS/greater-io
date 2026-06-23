import type { KeyValuePair } from './util'

interface IKeyValueStore<TKeyValue extends KeyValuePair> {
  get<K extends keyof TKeyValue>(key: K): TKeyValue[K]
  set<K extends keyof TKeyValue>(key: K, value: TKeyValue[K]): this
}

export type { IKeyValueStore }
