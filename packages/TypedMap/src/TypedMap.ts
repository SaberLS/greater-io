import type {
  ITypedMap,
  TypedEntries,
  TypedMapData,
  TypedMapValues,
} from './ITypedMap'

class TypedMap<TMap extends TypedMapData> implements ITypedMap<TMap> {
  #map: Map<keyof TMap, TypedMapValues<TMap>>

  constructor(defaultMap: TMap) {
    this.#map = new Map(
      Object.entries(defaultMap) as Iterable<
        readonly [keyof TMap, TypedMapValues<TMap>]
      >
    )
  }

  toObject(): TMap {
    return Object.fromEntries(this.#map) as TMap
  }

  forEach(
    callbackfn: (
      value: TypedMapValues<TMap>,
      key: keyof TMap,
      map: ReadonlyMap<keyof TMap, TypedMapValues<TMap>>
    ) => void
  ): void {
    // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-for-each
    this.#map.forEach(callbackfn)
  }

  has(key: keyof TMap): boolean {
    return this.#map.has(key)
  }

  keys(): IterableIterator<keyof TMap> {
    return this.#map.keys()
  }

  values(): IterableIterator<TMap[keyof TMap]> {
    return this.#map.values()
  }

  get size(): number {
    return this.#map.size
  }

  get<K extends keyof TMap>(key: K): TMap[K] {
    return this.#map.get(key) as TMap[K]
  }

  set<K extends keyof TMap>(key: K, value: TMap[K]): this {
    this.#map.set(key, value)
    return this
  }

  entries(): IterableIterator<TypedEntries<TMap>> {
    return this.#map.entries()
  }

  [Symbol.iterator](): MapIterator<[keyof TMap, TypedMapValues<TMap>]> {
    return this.#map[Symbol.iterator]()
  }
}
export { TypedMap }
