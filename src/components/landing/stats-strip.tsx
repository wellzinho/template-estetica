'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  { value: '12+', lines: ['ANOS DE', 'EXPERIÊNCIA'] },
  { value: '500+', lines: ['CASOS', 'ATENDIDOS'] },
  { value: 'UFPR', lines: ['FORMAÇÃO DE', 'ELITE'] },
] as const

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35, once: true })

  return (
    <section
      ref={ref}
      className="border-y border-rule bg-ink-raised py-[33px]"
      aria-label="Indicadores do escritório"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-3 gap-x-2 px-4 sm:gap-x-8 md:gap-x-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.value}
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[86px] flex-col justify-between border-l-2 border-gold pl-2 sm:pl-4 md:pl-5"
          >
            <p className="font-serif text-[clamp(1.75rem,7.5vw,3rem)] font-semibold leading-none text-gold sm:text-5xl md:text-[48px] md:leading-[57.6px]">
              {s.value}
            </p>
            <div className="space-y-0 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.7px] text-mist sm:text-sm sm:leading-tight">
              {s.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
