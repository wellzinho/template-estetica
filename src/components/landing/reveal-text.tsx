'use client'

import { motion, useInView } from 'framer-motion'
import { useMemo, useRef } from 'react'

type RevealTextProps = {
  text: string
  className?: string
  highlight?: string[]
  highlightClassName?: string
}

export function RevealText({
  text,
  className = '',
  highlight = [],
  highlightClassName = 'text-gold',
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { amount: 0.45, once: true })

  const words = useMemo(() => text.split(/(\s+)/), [text])

  return (
    <span ref={ref} className={className}>
      {words.map((chunk, i) => {
        if (/^\s+$/.test(chunk)) {
          return <span key={`s-${i}`}>{chunk}</span>
        }
        const isHi = highlight.some(
          (h) => h.toLowerCase() === chunk.replace(/[.,]/g, '').toLowerCase(),
        )
        return (
          <span key={`w-${i}`} className="inline-block overflow-hidden">
            <motion.span
              className={`inline-block ${isHi ? highlightClassName : ''}`}
              initial={{ y: '100%', opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.85,
                delay: i * 0.035,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {chunk}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}
