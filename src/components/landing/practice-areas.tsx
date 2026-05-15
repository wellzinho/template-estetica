'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  IconBriefcase,
  IconDocument,
  IconFamily,
  IconScales,
} from '@/components/landing/icons'
import { SpotlightCard } from '@/components/landing/spotlight-card'

const areas = [
  {
    title: 'Trabalhista',
    body: 'Defesa rigorosa dos direitos do empregado e consultoria preventiva para empresas.',
    Icon: IconBriefcase,
  },
  {
    title: 'Família',
    body: 'Mediação de conflitos, divórcios e planejamento sucessório com máxima discrição.',
    Icon: IconFamily,
  },
  {
    title: 'Criminal',
    body: 'Defesa em crimes de colarinho branco e atuação estratégica em tribunais superiores.',
    Icon: IconScales,
  },
  {
    title: 'Civil',
    body: 'Indenizações, contratos e direitos do consumidor com foco em resultados céleres.',
    Icon: IconDocument,
  },
] as const

export function PracticeAreas() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2, once: true })

  return (
    <section ref={ref} id="areas" className="bg-ink-soft py-16">
      {/* Figma: py 64, px 16, gap intro→grid 48px; título 48px; cards 2×2 gap 24, p 25 */}
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4">
        <div className="flex flex-col gap-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="w-full font-serif text-[clamp(2rem,11vw,3rem)] font-semibold leading-[1.2] text-marble md:text-[48px] md:leading-[57.6px]"
          >
            Áreas de atuação
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-2xl text-pretty text-base leading-6 text-mist"
          >
            Soluções jurídicas sob medida, desenhadas para enfrentar os desafios mais sofisticados do
            cenário jurídico contemporâneo.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {areas.map((a, i) => {
            const Icon = a.Icon
            return (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 * i, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                <SpotlightCard className="h-full">
                  <div className="flex flex-col gap-4">
                    <div className="flex size-12 items-center justify-center rounded-[2px] bg-gold-wash text-gold">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-serif text-[1.35rem] font-medium leading-snug text-marble sm:text-[1.65rem] md:text-[2rem]">
                      {a.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-mist sm:text-base sm:leading-relaxed">
                      {a.body}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
