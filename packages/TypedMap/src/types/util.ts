import type {
  Keys,
  KeyValuePair,
  ValueOf,
  Values,
} from '@greater-io/packages/key-value-store'

type TypedMapData = KeyValuePair
type TypedMapKeys<TMap extends TypedMapData> = Keys<TMap>
type TypedMapValues<TMap extends TypedMapData> = Values<TMap>

type TypedMapValue<
  TMap extends TypedMapData,
  K extends TypedMapKeys<TMap>,
> = ValueOf<TMap, K>

type TypedEntries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T]

export type {
  TypedEntries,
  TypedMapData,
  TypedMapKeys,
  TypedMapValue,
  TypedMapValues,
}
