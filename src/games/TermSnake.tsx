import { useEffect, useRef, useState } from 'react'
import { unlock } from '@/lib/achievements'
import { getBest, saveBest } from './storage'

const COLS = 26
const ROWS = 12

/** vrai pendant une partie : le terminal ignore alors les flèches. */
// eslint-disable-next-line react-refresh/only-export-components
export const snakeState = { running: false }

type P = [number, number]

/** Snake en caractères, jouable dans le terminal (flèches / WASD / ZQSD). */
export function TermSnake({ onEnd }: { onEnd: (score: number, record: boolean) => void }) {
  const [, force] = useState(0)
  const game = useRef({
    snake: [[6, 6], [5, 6], [4, 6]] as P[],
    dir: [1, 0] as P,
    next: [1, 0] as P,
    food: [15, 6] as P,
    score: 0,
    over: false,
  })

  useEffect(() => {
    snakeState.running = true
    const g = game.current
    const place = () => {
      let f: P
      do f = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)]
      while (g.snake.some(([x, y]) => x === f[0] && y === f[1]))
      g.food = f
    }
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const map: Record<string, P> = {
        arrowup: [0, -1], w: [0, -1], z: [0, -1],
        arrowdown: [0, 1], s: [0, 1],
        arrowleft: [-1, 0], a: [-1, 0], q: [-1, 0],
        arrowright: [1, 0], d: [1, 0],
      }
      const d = map[k]
      if (d) {
        e.preventDefault()
        e.stopPropagation()
        if (d[0] !== -g.dir[0] || d[1] !== -g.dir[1]) g.next = d
      } else if (k === 'escape') {
        g.over = true
      }
    }
    window.addEventListener('keydown', onKey, true)

    const tick = () => {
      if (g.over) return finish()
      g.dir = g.next
      const head: P = [(g.snake[0][0] + g.dir[0] + COLS) % COLS, (g.snake[0][1] + g.dir[1] + ROWS) % ROWS]
      if (g.snake.some(([x, y]) => x === head[0] && y === head[1])) {
        g.over = true
        return finish()
      }
      g.snake.unshift(head)
      if (head[0] === g.food[0] && head[1] === g.food[1]) {
        g.score += 1
        if (g.score === 10) unlock('snake')
        place()
      } else g.snake.pop()
      force((n) => n + 1)
      timer = window.setTimeout(tick, Math.max(65, 150 - g.score * 5))
    }
    let timer = window.setTimeout(tick, 400)
    let ended = false
    function finish() {
      if (ended) return
      ended = true
      snakeState.running = false
      window.removeEventListener('keydown', onKey, true)
      force((n) => n + 1)
      onEnd(g.score, saveBest('snake', g.score))
    }
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey, true)
      snakeState.running = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const g = game.current
  const rows: string[] = []
  rows.push('┌' + '─'.repeat(COLS) + '┐')
  for (let y = 0; y < ROWS; y++) {
    let line = '│'
    for (let x = 0; x < COLS; x++) {
      const i = g.snake.findIndex(([sx, sy]) => sx === x && sy === y)
      if (i === 0) line += '@'
      else if (i > 0) line += 'o'
      else if (g.food[0] === x && g.food[1] === y) line += '◆'
      else line += ' '
    }
    rows.push(line + '│')
  }
  rows.push('└' + '─'.repeat(COLS) + '┘')
  const best = getBest('snake')

  return (
    <div className="t-snake">
      <div>
        🐍 Score : <b>{g.score}</b> · Record : {best ?? '—'} {g.over ? '· Partie terminée' : '· flèches/ZQSD, Échap pour quitter'}
      </div>
      <pre>{rows.join('\n')}</pre>
    </div>
  )
}
