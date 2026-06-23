type TypedMapData = Record<keyof object, never>
type TypedMapKeys<TMap extends TypedMapData> = keyof TMap
type TypedMapValues<TMap extends TypedMapData> = TMap[TypedMapKeys<TMap>]

type TypedMapValue<
  TMap extends TypedMapData,
  K extends TypedMapKeys<TMap>,
> = TMap[K]

interface ITypedMap<TMap extends TypedMapData> {
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

type TypedEntries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T]

export type {
  ITypedMap,
  TypedEntries,
  TypedMapData,
  TypedMapKeys,
  TypedMapValue,
  TypedMapValues,
}
