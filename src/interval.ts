import { delay } from './delay'
import { AbortController } from 'abort-controller'
export function interval(duration: number, immediate = false): AsyncIterable<number> {
  return {
    [Symbol.asyncIterator]() {
      const ac = new AbortController()
      let i = 0
      return {
        next() {
          return i === 0 && immediate
            ? Promise.resolve({ value: i++, done: false })
            : delay(duration, ac.signal).then(_ => ({ value: i++, done: false }))
        },
        async return() {
          ac.abort()
          return { done: true } as IteratorResult<number>
        },
        async throw(err) {
          /* istanbul ignore next */
          {
            ac.abort()
            throw err
          }
        }
      }
    }
  }
}
