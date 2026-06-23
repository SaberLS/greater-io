import { IndexedStore } from '../../src'

interface TestValue {
  id: string
  name: string
}

describe('IndexedStore', () => {
  let store: IndexedStore<string, TestValue>

  const value1: TestValue = {
    id: 'lobby-1',
    name: 'Lobby 1',
  }

  const value2: TestValue = {
    id: 'lobby-2',
    name: 'Lobby 2',
  }

  beforeEach(() => {
    store = new IndexedStore<string, TestValue>()
  })

  describe('assignToIndex', () => {
    it('should store value by index and id', () => {
      store.assignToIndex('user-1', value1)

      expect(store.getByIndex('user-1')).toBe(value1)
      expect(store.getById('lobby-1')).toBe(value1)
    })

    it('should return assigned value', () => {
      expect(store.assignToIndex('user-1', value1)).toBe(value1)
    })
  })

  describe('getByIndex', () => {
    it('should return undefined for missing index', () => {
      expect(store.getByIndex('missing')).toBeUndefined()
    })
  })

  describe('getById', () => {
    it('should return undefined for missing id', () => {
      expect(store.getById('missing')).toBeUndefined()
    })
  })

  describe('hasIndex', () => {
    it('should return true when index exists', () => {
      store.assignToIndex('user-1', value1)

      expect(store.hasIndex('user-1')).toBe(true)
    })

    it('should return false when index does not exist', () => {
      expect(store.hasIndex('user-1')).toBe(false)
    })
  })

  describe('deleteByIndex', () => {
    it('should remove index mapping', () => {
      store.assignToIndex('user-1', value1)

      expect(store.deleteByIndex('user-1')).toBe(true)
      expect(store.getByIndex('user-1')).toBeUndefined()
    })

    it('should return false when index does not exist', () => {
      expect(store.deleteByIndex('missing')).toBe(false)
    })
  })

  describe('deleteById', () => {
    it('should remove id mapping', () => {
      store.assignToIndex('user-1', value1)

      expect(store.deleteById(value1.id)).toBe(true)
      expect(store.getById(value1.id)).toBeUndefined()
    })

    it('should return false when id does not exist', () => {
      expect(store.deleteById('missing')).toBe(false)
    })
  })

  describe('counts', () => {
    it('should track counts', () => {
      expect(store.indexCount).toBe(0)
      expect(store.valueCount).toBe(0)

      store.assignToIndex('user-1', value1)
      store.assignToIndex('user-2', value2)

      expect(store.indexCount).toBe(2)
      expect(store.valueCount).toBe(2)
    })

    it('should update counts after clear', () => {
      store.assignToIndex('user-1', value1)
      store.assignToIndex('user-2', value2)

      store.clear()

      expect(store.indexCount).toBe(0)
      expect(store.valueCount).toBe(0)
    })
  })

  describe('clear', () => {
    it('should remove all mappings', () => {
      store.assignToIndex('user-1', value1)
      store.assignToIndex('user-2', value2)

      store.clear()

      expect(store.getByIndex('user-1')).toBeUndefined()
      expect(store.getByIndex('user-2')).toBeUndefined()

      expect(store.getById(value1.id)).toBeUndefined()
      expect(store.getById(value2.id)).toBeUndefined()
    })
  })
})
