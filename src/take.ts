import { deferP0 } from 'ts-functional-pipe'

export async function* _take<T>(src: AsyncIterable<T>, amt: number): AsyncIterable<T> {
  if (amt <= 0) {
    return
  }
  let i = 0
  for await (const x of src) {
    yield x
    ++i
    if (i >= amt) {
      break
    }
  }
}

export const take = deferP0(_take)
