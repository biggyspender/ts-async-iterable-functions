import { deferP0 } from 'ts-functional-pipe'

export async function _toArray<T>(src: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = []
  for await (const x of src) {
    out.push(x)
  }
  return out
}

export const toArray = deferP0(_toArray)
