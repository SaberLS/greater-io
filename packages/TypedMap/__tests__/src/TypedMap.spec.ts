import { TypedMap } from '../../src'

interface TestMap {
  count: number
  name: string
  active: boolean
}

describe('TypedMap', () => {
  let map: TypedMap<TestMap>

  beforeEach(() => {
    map = new TypedMap<TestMap>({
      count: 1,
      name: 'John',
      active: true,
    })
  })

  describe('constructor', () => {
    it('should initialize with provided values', () => {
      expect(map.get('count')).toBe(1)
      expect(map.get('name')).toBe('John')
      expect(map.get('active')).toBe(true)
    })

    it('should initialize size correctly', () => {
      expect(map.size).toBe(3)
    })
  })

  describe('get', () => {
    it('should return stored value', () => {
      expect(map.get('count')).toBe(1)
      expect(map.get('name')).toBe('John')
    })
  })

  describe('set', () => {
    it('should update existing value', () => {
      map.set('count', 42)

      expect(map.get('count')).toBe(42)
    })

    it('should return itself for chaining', () => {
      const result = map.set('count', 42)

      expect(result).toBe(map)
    })
  })

  describe('has', () => {
    it('should return true for existing keys', () => {
      expect(map.has('count')).toBe(true)
      expect(map.has('name')).toBe(true)
      expect(map.has('active')).toBe(true)
    })
  })

  describe('size', () => {
    it('should return number of entries', () => {
      expect(map.size).toBe(3)
    })
  })

  describe('toObject', () => {
    it('should convert map to object', () => {
      expect(map.toObject()).toEqual({
        count: 1,
        name: 'John',
        active: true,
      })
    })

    it('should reflect updated values', () => {
      map.set('count', 100)

      expect(map.toObject()).toEqual({
        count: 100,
        name: 'John',
        active: true,
      })
    })
  })

  describe('keys', () => {
    it('should iterate over keys', () => {
      expect([...map.keys()]).toEqual(['count', 'name', 'active'])
    })
  })

  describe('values', () => {
    it('should iterate over values', () => {
      expect([...map.values()]).toEqual([1, 'John', true])
    })
  })

  describe('entries', () => {
    it('should iterate over entries', () => {
      expect([...map.entries()]).toEqual([
        ['count', 1],
        ['name', 'John'],
        ['active', true],
      ])
    })
  })

  describe('forEach', () => {
    it('should iterate over every entry', () => {
      const callback = jest.fn()

      // eslint-disable-next-line unicorn/no-array-for-each, unicorn/no-array-callback-reference
      map.forEach(callback)

      expect(callback).toHaveBeenCalledTimes(3)

      expect(callback).toHaveBeenNthCalledWith(1, 1, 'count', expect.any(Map))

      expect(callback).toHaveBeenNthCalledWith(
        2,
        'John',
        'name',
        expect.any(Map)
      )

      expect(callback).toHaveBeenNthCalledWith(
        3,
        true,
        'active',
        expect.any(Map)
      )
    })
  })

  describe('Symbol.iterator', () => {
    it('should support for...of iteration', () => {
      const entries = []

      for (const entry of map) {
        entries.push(entry)
      }

      expect(entries).toEqual([
        ['count', 1],
        ['name', 'John'],
        ['active', true],
      ])
    })
  })

  it('should support empty initialization', () => {
    const map = new TypedMap<Record<string, never>>({})

    expect(map.size).toBe(0)
    expect([...map.keys()]).toEqual([])
    expect([...map.values()]).toEqual([])
    expect([...map.entries()]).toEqual([])
  })
})
