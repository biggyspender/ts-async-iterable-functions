import { deferP0 } from 'ts-functional-pipe'
import { createQueue } from 'ts-async-iterable-queue'

export async function* _skipLast<T>(src: AsyncIterable<T>, amt: number): AsyncIterable<T> {
  const q = createQueue<T>()
  for await (const x of src) {
    q.enqueue(x)
    if (q.length > amt) {
      yield q.dequeue()!
    }
  }
}

export const skipLast = deferP0(_skipLast)
