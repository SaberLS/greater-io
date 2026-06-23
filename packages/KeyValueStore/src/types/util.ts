type KeyValuePair = Record<keyof object, never>
type Keys<TKeyValue extends KeyValuePair> = keyof TKeyValue
type Values<TKeyValue extends KeyValuePair> = TKeyValue[Keys<TKeyValue>]
type ValueOf<
  TKeyValue extends KeyValuePair,
  Key extends Keys<TKeyValue>,
> = TKeyValue[Key]

export type { KeyValuePair, Keys, ValueOf, Values }
