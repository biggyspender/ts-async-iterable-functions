import { performance } from 'perf_hooks'
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
  count,
  interval,
  merge,
  takeUntil,
  OneOf
} from '../src/ts-async-iterable-functions'
import { createPushAsyncIterable } from 'ts-async-iterable-queue'

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
  it('works with 0 items', async () => {
    const val = await pp([1, 2, 3, 4], toAsyncIterable(), take(0), toArray())
    expect(val).toHaveLength(0)
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

describe('interval', () => {
  it('works', async () => {
    const val = await pp(interval(250), take(4), toArray())
    expect(val).toEqual([0, 1, 2, 3])
  })
  it('keeps time', async () => {
    const now = performance.now()
    await pp(interval(250), take(4), toArray())
    const time = performance.now() - now
    expect(time).toBeGreaterThanOrEqual(1000)
    expect(time).toBeLessThan(1250)
  })
  it('keeps time2', async () => {
    const now = performance.now()
    await pp(interval(250, true), take(4), toArray())
    const time = performance.now() - now
    expect(time).toBeGreaterThanOrEqual(750)
    expect(time).toBeLessThan(1000)
  })
  it('stops', async () => {
    try {
      for await (const i of interval(250, true)) {
        if (i > 2) {
          throw Error()
        }
      }
    } catch {
      return
    }
    throw Error("shouldn't be here")
  })
  it('buffers correctly!', async () => {
    const pl = pp(interval(250, true), take(4), toArray())
    await pp(interval(780), take(1), toArray())
    const now = performance.now()
    const val = await pl
    const time = performance.now() - now
    expect(val).toEqual([0, 1, 2, 3])
    expect(time).toBeLessThan(50)
  })
})
describe('takeUntil', () => {
  it('works', async () => {
    const c = await pp(interval(300), map(x => x), takeUntil(interval(1000)), toArray())
    console.log(c)
    expect(c.length).toBe(3)
  })
})

function isFirst<T1, T2>(obj: OneOf<T1, T2>): obj is [T1, undefined] {
  return typeof obj[0] !== 'undefined'
}

describe('merge', () => {
  it('works', async () => {
    const src1 = pp([1, 2, 3, 4], toAsyncIterable())
    const src2 = pp([5, 6, 7, 8], toAsyncIterable())
    const out: number[] = await pp(
      src1,
      merge(src2),
      map((x: OneOf<number, number>) => (isFirst(x) ? x[0] : x[1])),
      toArray()
    )
    // console.log(out)
    out.sort((a, b) => a - b)
    expect(out).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
  it('handles errors', async () => {
    const src1 = createPushAsyncIterable<number>(s => {
      s.error(Error('woo'))
    })
    const src2 = pp([5, 6, 7, 8], toAsyncIterable())
    try {
      await pp(src1, merge(src2), toArray())
    } catch (e) {
      expect(e.message).toBe('woo')
      return
    }
    throw Error("shouldn't get here")
  })
})
