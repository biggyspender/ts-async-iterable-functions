import { deferP0, pp } from 'ts-functional-pipe'
import { filter } from './filter'

export async function _lastValue<T>(
  src: AsyncIterable<T>,
  pred: (item: T, idx: number) => boolean = () => true
): Promise<T | undefined> {
  let item: T | undefined
  for await (const x of pp(src, filter(pred))) {
    item = x
  }
  return item
}

export const lastValue = deferP0(_lastValue)
