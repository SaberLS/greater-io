import type { IIndexedStore, ObjectWithID } from './IIndexedStore'

class IndexedStore<
  TIndex extends PropertyKey,
  TValue extends ObjectWithID,
> implements IIndexedStore<TIndex, TValue> {
  protected readonly _indexToValue = new Map<TIndex, TValue>()
  protected readonly _idToValue = new Map<TValue['id'], TValue>()
  protected readonly _idToIndex = new Map<TValue['id'], TIndex>()

  deleteByIndex(index: TIndex): boolean {
    const value = this._indexToValue.get(index)

    if (!value) return false

    this._indexToValue.delete(index)
    this._idToValue.delete(value.id)
    this._idToIndex.delete(value.id)

    return true
  }

  deleteById(valueId: TValue['id']): boolean {
    const value = this._idToValue.get(valueId)

    if (!value) return false

    const index = this._idToIndex.get(valueId)

    this._idToValue.delete(valueId)
    this._idToIndex.delete(valueId)

    if (index !== undefined) {
      this._indexToValue.delete(index)
    }

    return true
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
    if (this._indexToValue.has(index)) throw new Error('Index already assigned')

    if (this._idToValue.has(value.id)) throw new Error('Value already assigned')

    this._indexToValue.set(index, value)
    this._idToValue.set(value.id, value)
    this._idToIndex.set(value.id, index)

    return value
  }

  clear(): void {
    this._indexToValue.clear()
    this._idToValue.clear()
    this._idToIndex.clear()
  }

  get valueCount(): number {
    return this._indexToValue.size
  }

  get indexCount(): number {
    return this._idToValue.size
  }
}

export { IndexedStore }
