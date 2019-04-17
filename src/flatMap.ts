import { deferP0 } from 'ts-functional-pipe'

function isAsyncIterable<T>(obj: AsyncIterable<T> | Iterable<T>): obj is AsyncIterable<T> {
  return !!(obj as any)[Symbol.asyncIterator]
}

export async function* _flatMap<T, TOut>(
  src: AsyncIterable<T>,
  selector: (item: T, idx: number) => AsyncIterable<TOut> | Iterable<TOut>
): AsyncIterable<TOut> {
  let i = 0
  for await (const seq of src) {
    const selected = selector(seq, i++)
    if (isAsyncIterable(selected)) {
      for await (const item of selected) {
        yield item
      }
    } else {
      for (const item of selected) {
        yield item
      }
    }
  }
}

export const flatMap = deferP0(_flatMap)
