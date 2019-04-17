import { deferP0 } from 'ts-functional-pipe'

export async function* _toAsyncIterable<T>(src: Iterable<T>): AsyncIterable<T> {
  for (const x of src) {
    yield x
  }
}

export const toAsyncIterable = deferP0(_toAsyncIterable)
