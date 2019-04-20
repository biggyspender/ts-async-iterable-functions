import { deferP0, pp } from 'ts-functional-pipe'
import { _merge } from './merge'
import { _take } from './take'
import { createPromiseResolver } from 'ts-async-iterable-queue'
import { _map, map } from './map'

export async function* _takeUntil<T, TOther>(
  src: AsyncIterable<T>,
  other: AsyncIterable<TOther>
): AsyncIterable<T> {
  const pr = createPromiseResolver()

    // tslint:disable-next-line: no-floating-promises
  ;(async () => {
    for await (const _ of _take(other, 1)) {
      pr.resolve()
    }
  })()

  const it = src[Symbol.asyncIterator]()
  try {
    for (;;) {
      const r = await Promise.race([pr.promise, it.next()])
      if (typeof r === 'undefined') {
        break
      }
      /* istanbul ignore if */
      if (r.done) {
        break
      }
      yield r.value
    }
    it.return && (await it.return())
  } catch (e) {
    /* istanbul ignore next */
    it.throw && it.throw(e)
  }
}

export const takeUntil = deferP0(_takeUntil)
