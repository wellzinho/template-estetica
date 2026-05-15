'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MagneticButton } from '@/components/landing/magnetic-button'

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35, once: true })

  return (
    <section
      ref={ref}
      id="contato"
      className="bg-gold-muted px-4 py-16 md:px-6"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl px-2 font-serif text-[clamp(2.25rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-cocoa md:px-0"
        >
          O sucesso do seu caso começa aqui
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-base leading-relaxed text-cocoaSoft opacity-90"
        >
          Não deixe para depois a proteção do que você construiu. Nossa equipe está pronta para atuar com
          exclusividade.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.16, duration: 0.75 }}
          className="pt-2"
        >
          <MagneticButton
            href="mailto:contato@valente.adv.br"
            padding="hero"
            className="bg-cocoa text-white hover:bg-[#2a1f00]"
          >
            Agendar consulta
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
