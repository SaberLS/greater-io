interface ObjectWithID {
  get id(): PropertyKey
}

interface IIndexedStore<
  TIndex extends PropertyKey,
  TValue extends ObjectWithID,
> {
  assignToIndex(index: TIndex, value: TValue): TValue
  hasIndex(index: TIndex): boolean

  deleteByIndex(index: TIndex): boolean
  deleteById(valueId: TValue['id']): boolean

  getById(valueId: TValue['id']): TValue | undefined
  getByIndex(index: TIndex): TValue | undefined

  clear(): void
  get indexCount(): number
  get valueCount(): number
}

export type { IIndexedStore, ObjectWithID }
