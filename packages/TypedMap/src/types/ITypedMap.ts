import type { IKeyValueStore } from '@greater-io/packages/key-value-store'
import type {
  TypedEntries,
  TypedMapData,
  TypedMapKeys,
  TypedMapValue,
  TypedMapValues,
} from './util'

interface ITypedMap<
  TMap extends TypedMapData,
> extends IKeyValueStore<TypedMapData> {
  get<K extends TypedMapKeys<TMap>>(key: K): TypedMapValue<TMap, K>
  set<K extends TypedMapKeys<TMap>>(key: K, value: TypedMapValue<TMap, K>): this
  toObject(): TMap

  forEach(
    callbackfn: (
      value: TypedMapValues<TMap>,
      key: keyof TMap,
      map: ReadonlyMap<keyof TMap, TypedMapValues<TMap>>
    ) => void
  ): void

  entries(): IterableIterator<TypedEntries<TMap>>
  keys(): IterableIterator<keyof TMap>
  values(): IterableIterator<TMap[keyof TMap]>
}

export type { ITypedMap }
