import { createPushAsyncIterable } from 'ts-async-iterable-queue'

export function interval(duration: number, immediate = false): AsyncIterable<number> {
  const pq = createPushAsyncIterable<number>((next, _, __, addCompletionHandler) => {
    let i = 0
    if (immediate) {
      next(i++)
    }
    const intId = setInterval(() => next(i++), duration)
    addCompletionHandler(() => {
      clearInterval(intId)
    })
  })
  return pq
}
