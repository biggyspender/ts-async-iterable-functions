import { deferP0 } from 'ts-functional-pipe'
import { _merge } from './merge'
import { _take } from './take'

export async function* _takeUntil<T, TOther>(
  src: AsyncIterable<T>,
  other: AsyncIterable<TOther>
): AsyncIterable<T> {
  for await (const [srcItem, otherItem] of _merge(src, _take(other, 1))) {
    if (otherItem !== undefined) {
      break
    }
    yield srcItem!
  }
}

export const takeUntil = deferP0(_takeUntil)
