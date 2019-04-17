import { deferP0 } from 'ts-functional-pipe'
import { createQueue } from 'ts-async-iterable-queue'

export async function* _takeLast<T>(src: AsyncIterable<T>, amt: number): AsyncIterable<T> {
  const q = createQueue<T>()

  for await (const x of src) {
    q.enqueue(x)
    if (q.length > amt) {
      q.dequeue()
    }
  }
  while (q.length > 0) {
    yield q.dequeue()!
  }
}

export const takeLast = deferP0(_takeLast)
