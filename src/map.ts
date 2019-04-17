import { deferP0 } from 'ts-functional-pipe'

export async function* _map<T, TOut>(
  src: AsyncIterable<T>,
  selector: (item: T, idx: number) => TOut
): AsyncIterable<TOut> {
  let i = 0
  for await (const x of src) {
    yield selector(x, i++)
  }
}

export const map = deferP0(_map)
