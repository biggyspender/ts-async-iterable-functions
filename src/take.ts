import { deferP0 } from 'ts-functional-pipe'

export async function* _take<T>(src: AsyncIterable<T>, amt: number): AsyncIterable<T> {
  let i = 0
  for await (const x of src) {
    if (i++ >= amt) {
      break
    }
    yield x
  }
}

export const take = deferP0(_take)
