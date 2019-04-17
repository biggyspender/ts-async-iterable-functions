import { deferP0 } from 'ts-functional-pipe'

export async function* _skip<T>(src: AsyncIterable<T>, amt: number): AsyncIterable<T> {
  let i = 0
  for await (const x of src) {
    if (i++ < amt) {
      continue
    }
    yield x
  }
}

export const skip = deferP0(_skip)
