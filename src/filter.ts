import { deferP0 } from 'ts-functional-pipe'

export async function* _filter<T>(
  src: AsyncIterable<T>,
  pred: (item: T, idx: number) => boolean
): AsyncIterable<T> {
  let i = 0
  for await (const x of src) {
    if (pred(x, i++)) {
      yield x
    }
  }
}

export const filter = deferP0(_filter)
