import type { IIndexedStore, ObjectWithID } from './IIndexedStore'

class IndexedStore<
  TIndex extends PropertyKey,
  TValue extends ObjectWithID,
> implements IIndexedStore<TIndex, TValue> {
  protected readonly _indexToValue = new Map<TIndex, TValue>()
  protected readonly _idToValue = new Map<TValue['id'], TValue>()

  deleteByIndex(index: TIndex): boolean {
    return this._indexToValue.delete(index)
  }

  deleteById(valueId: TValue['id']): boolean {
    return this._idToValue.delete(valueId)
  }

  getById(valueId: TValue['id']): TValue | undefined {
    return this._idToValue.get(valueId)
  }

  getByIndex(index: TIndex): TValue | undefined {
    return this._indexToValue.get(index)
  }

  hasIndex(index: TIndex): boolean {
    return this._indexToValue.has(index)
  }

  assignToIndex(index: TIndex, value: TValue): TValue {
    this._idToValue.set(value.id, value)
    this._indexToValue.set(index, value)

    return value
  }

  clear(): void {
    this._idToValue.clear()
    this._indexToValue.clear()
  }

  get valueCount(): number {
    return this._idToValue.size
  }

  get indexCount(): number {
    return this._indexToValue.size
  }
}

export { IndexedStore }
