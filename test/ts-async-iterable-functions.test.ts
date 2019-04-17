import { pp } from 'ts-functional-pipe'
import {
  toAsyncIterable,
  toArray,
  takeLast,
  skipLast,
  take,
  skip,
  map,
  flatMap,
  _toAsyncIterable,
  lastValue,
  count
} from '../src/ts-async-iterable-functions'

describe('toAsyncIterable', () => {
  it('works', async () => {
    const val = await pp([1, 2, 3, 4], toAsyncIterable(), toArray())
    expect(val).toEqual([1, 2, 3, 4])
  })
})
describe('take', () => {
  it('works', async () => {
    const val = await pp([1, 2, 3, 4], toAsyncIterable(), take(2), toArray())
    expect(val).toEqual([1, 2])
  })
})
describe('takeLast', () => {
  it('works', async () => {
    const val = await pp([1, 2, 3, 4], toAsyncIterable(), takeLast(2), toArray())
    expect(val).toEqual([3, 4])
  })
})
describe('skipLast', () => {
  it('works', async () => {
    const val = await pp([1, 2, 3, 4], toAsyncIterable(), skipLast(2), toArray())
    expect(val).toEqual([1, 2])
    const val2 = await pp([1, 2, 3, 4], toAsyncIterable(), skipLast(1), skipLast(1), toArray())
    expect(val2).toEqual([1, 2])
  })
})
describe('skip', () => {
  it('works', async () => {
    const val = await pp([1, 2, 3, 4], toAsyncIterable(), skip(2), toArray())
    expect(val).toEqual([3, 4])
  })
})
describe('map', () => {
  it('works', async () => {
    const val = await pp([1, 2, 3, 4], toAsyncIterable(), map(x => x * 2), toArray())
    expect(val).toEqual([2, 4, 6, 8])
  })
})
describe('flatMap', () => {
  it('works', async () => {
    const val = await pp(
      [1, 2, 3, 4],
      toAsyncIterable(),
      flatMap(x => _toAsyncIterable([x, x])),
      toArray()
    )
    expect(val).toEqual([1, 1, 2, 2, 3, 3, 4, 4])
    const val2 = await pp([1, 2, 3, 4], toAsyncIterable(), flatMap(x => [x, x]), toArray())
    expect(val2).toEqual([1, 1, 2, 2, 3, 3, 4, 4])
  })
})
describe('lastValue', () => {
  it('works', async () => {
    const val = await pp([1, 2, 3, 4], toAsyncIterable(), lastValue())
    expect(val).toEqual(4)
    const val2 = await pp([1, 2, 3, 4], toAsyncIterable(), lastValue(x => x < 3))
    expect(val2).toEqual(2)
  })
})
describe('count', () => {
  it('works', async () => {
    const val = await pp([1, 2, 3, 4], toAsyncIterable(), count(x => x > 2))
    expect(val).toEqual(2)
    const val2 = await pp([1, 2, 3, 4], toAsyncIterable(), count())
    expect(val2).toEqual(4)
  })
})
