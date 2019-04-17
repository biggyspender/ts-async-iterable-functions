import { AbortSignal } from 'abort-controller'
export const delay = (t: number, abortSignal?: AbortSignal) => {
  let intervalId: number
  let reject: (reason: any) => void
  let p = new Promise((r, rej) => {
    intervalId = setTimeout(r, t)
    reject = rej
  })
  if (abortSignal !== undefined) {
    const handler = () => {
      clearInterval(intervalId)
      reject(Error('aborted'))
    }
    abortSignal.addEventListener('abort', handler)
    p = p.finally(() => {
      abortSignal.removeEventListener('abort', handler)
    })
  }
  return p
}
