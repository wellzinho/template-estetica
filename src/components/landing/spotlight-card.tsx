'use client'

import { useRef, useState } from 'react'
import { motion, useMotionTemplate, useSpring } from 'framer-motion'

type SpotlightCardProps = {
  children: React.ReactNode
  className?: string
}

export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const mx = useSpring(50, { stiffness: 280, damping: 22 })
  const my = useSpring(50, { stiffness: 280, damping: 22 })
  const rx = useSpring(0, { stiffness: 220, damping: 20 })
  const ry = useSpring(0, { stiffness: 220, damping: 20 })

  const border = useMotionTemplate`radial-gradient(420px at ${mx}% ${my}%, rgba(230,195,100,0.55), rgba(230,195,100,0.08) 42%, transparent 65%)`

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 100)
    my.set(((e.clientY - r.top) / r.height) * 100)
    rx.set((e.clientY - r.top - r.height / 2) / 18)
    ry.set(-(e.clientX - r.left - r.width / 2) / 18)
  }

  const reset = () => {
    mx.set(50)
    my.set(50)
    rx.set(0)
    ry.set(0)
    setHover(false)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-[2px] bg-ink-card p-[1px] ${className}`}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
      }}
      onPointerEnter={() => setHover(true)}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[2px] opacity-0 transition-opacity duration-500"
        style={{
          backgroundImage: border,
          opacity: hover ? 1 : 0,
        }}
      />
      <div className="relative h-full rounded-[2px] bg-ink-card p-[25px]">{children}</div>
    </motion.div>
  )
}
