/** Petit signal "la scène 3D a été créée et a rendu sa première frame". */
let ready = false
const listeners = new Set<() => void>()

export function markSceneReady() {
  if (ready) return
  ready = true
  listeners.forEach((l) => l())
  listeners.clear()
}

export function onSceneReady(cb: () => void): () => void {
  if (ready) {
    cb()
    return () => {}
  }
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function isSceneReady() {
  return ready
}
