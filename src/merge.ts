import { createPushAsyncIterable } from 'ts-async-iterable-queue'
import { deferP0 } from 'ts-functional-pipe'

export type OneOf<T1, T2> = [T1, undefined] | [undefined, T2]

export const _merge = <T1, T2>(
  s1: AsyncIterable<T1>,
  s2: AsyncIterable<T2>
): AsyncIterable<OneOf<T1, T2>> => {
  return createPushAsyncIterable<OneOf<T1, T2>>(s => {
    const it1 = s1[Symbol.asyncIterator]()
    const it2 = s2[Symbol.asyncIterator]()
      // tslint:disable-next-line: no-floating-promises
    ;(async () => {
      try {
        for (;;) {
          const itRes = await it1.next()
          if (itRes.done) {
            break
          }
          s.next([itRes.value, undefined])
        }
        it2.return && (await it2.return())
        s.complete()
      } catch (e) {
        s.error(e)
      }
    })()
    // tslint:disable-next-line: no-floating-promises
    ;(async () => {
      try {
        for (;;) {
          const itRes = await it2.next()
          if (itRes.done) {
            break
          }
          s.next([undefined, itRes.value])
        }
        it1.return && (await it1.return())
        s.complete()
      } catch (e) {
        /* istanbul ignore next */
        s.error(e)
      }
    })()
  })

  // const q = createAsyncQueue<OneOf<T1, T2>>();
  // // tslint:disable-next-line: no-floating-promises
  // Promise.all(
  //     [s1, s2].map(async (src, idx) => {
  //         for await (const x of src) {
  //             q.enqueue(idx === 0 ? [x as T1, undefined] : [undefined, x as T2]);
  //         }
  //     })
  // )
  //     .catch(e => q.error(e))
  //     .finally(() => q.complete())
  // return q;
}
export const merge = deferP0(_merge)
