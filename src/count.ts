import { deferP0, pp } from 'ts-functional-pipe'
import { filter } from './filter'

export async function _count<T>(
  src: AsyncIterable<T>,
  pred: (item: T, idx: number) => boolean = () => true
): Promise<number> {
  let i = 0
  for await (const _ of pp(src, filter(pred))) {
    ++i
  }
  return i
}

export const count = deferP0(_count)
