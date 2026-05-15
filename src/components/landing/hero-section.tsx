'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HeroBackgroundVideo } from '@/components/landing/hero-background-video'
import { MagneticButton } from '@/components/landing/magnetic-button'
import { RevealText } from '@/components/landing/reveal-text'

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.07])
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const streakOpacity = useTransform(scrollYProgress, [0, 0.6], [0.55, 0.2])
  const streakX = useTransform(scrollYProgress, [0, 1], ['-20%', '10%'])

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative isolate -mt-20 flex min-h-[min(100svh,820px)] items-center px-4 pb-16 pt-28 md:-mt-[120px] md:min-h-[min(100dvh,820px)] md:pb-[80px] md:pt-[120px]"
    >
      <motion.div className="absolute inset-0 -z-20" style={{ scale: imgScale, y: imgY }}>
        <HeroBackgroundVideo className="size-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[rgba(13,13,13,0.7)]" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/4 -z-[5] h-[120%] w-[80%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(230,195,100,0.22),transparent_62%)] blur-3xl"
        style={{ opacity: streakOpacity, x: streakX }}
      />

      {/* Figma: gap ~7px entre rótulo, título e CTA; px 16; título 56px / leading 70.4 no frame 700px */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-[7px]">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold"
        >
          Advocacia estratégica
        </motion.p>

        <h1 className="w-full font-serif text-[clamp(2.125rem,9.2vw,3.5rem)] font-bold leading-[1.22] tracking-[-0.02em] text-marble md:max-w-none md:text-[56px] md:leading-[70px] md:tracking-[-0.018em]">
          <RevealText
            text="Soluções jurídicas para proteger seus Direitos e seu Patrimônio"
            highlight={['Direitos', 'Patrimônio']}
          />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4 md:pt-[17px]"
        >
          <MagneticButton
            href="#contato"
            padding="hero"
            className="bg-gold text-cocoa hover:bg-gold-muted"
          >
            Agendar consulta agora
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
