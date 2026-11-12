import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { onToast, type ToastMsg } from '@/lib/toast'
import { EASE } from '@/lib/motion'

/** Affiche les notifications envoyées par toast(). */
export function Toaster() {
  const [items, setItems] = useState<ToastMsg[]>([])

  useEffect(
    () =>
      onToast((t) => {
        setItems((v) => [...v.slice(-2), t])
        window.setTimeout(() => setItems((v) => v.filter((x) => x.id !== t.id)), 2600)
      }),
    [],
  )

  return (
    <div className="toaster" role="status" aria-live="polite">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            className="toast"
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <span className="toast__dot" />
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
