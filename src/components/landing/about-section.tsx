'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { figmaAssets } from '@/lib/figma-assets'

const pillars = [
  {
    title: 'Jurimetria',
    body: 'Decisões baseadas em dados e probabilidades reais.',
  },
  {
    title: 'Linguagem Clara',
    body: 'Direito sem "juridiquês" para você entender tudo.',
  },
  {
    title: '100% Digital',
    body: 'Atendimento em todo o Brasil via plataforma segura.',
  },
  {
    title: 'Visão Estratégica',
    body: 'Foco na resolução eficiente do conflito.',
  },
] as const

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2, once: true })

  return (
    <section ref={ref} id="sobre" className="bg-ink py-12 sm:py-16">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 flex min-w-0 flex-col gap-3 sm:gap-4 lg:order-2 lg:col-start-2 lg:row-start-1"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold sm:text-sm">
            Conheça o especialista
          </p>
          <h2 className="font-serif text-[clamp(1.875rem,7vw,2.75rem)] font-semibold leading-[1.12] tracking-tight text-marble sm:text-[clamp(2rem,8vw,3rem)] sm:leading-[1.15] lg:text-[48px] lg:leading-[60px]">
            Dr. Eduardo
            <br />
            Valente
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.04, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 w-full pb-2 lg:order-1 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:pb-0"
        >
          <div className="relative mx-auto w-full max-w-[min(100%,420px)] overflow-visible lg:mx-0 lg:max-w-none">
            <div className="relative aspect-square w-full overflow-hidden rounded-[2px] shadow-lift">
              <Image
                src={figmaAssets.drValente}
                alt="Dr. Eduardo Valente"
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-white mix-blend-saturation" />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-5 -right-5 size-28 border-b-2 border-r-2 border-gold sm:-bottom-6 sm:-right-6 sm:size-32"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-3 flex min-w-0 flex-col gap-5 lg:order-2 lg:col-start-2 lg:row-start-2 lg:gap-4"
        >
          <p className="max-w-xl font-sans text-[15px] font-normal leading-[1.5] text-marble sm:text-base sm:leading-6 lg:pt-1">
            Com formação sólida na UFPR e mais de uma década de atuação, o Dr. Eduardo Valente lidera um
            escritório focado em advocacia de resultados, unindo tradição jurídica e inovação tecnológica.
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 pt-0 sm:gap-x-6 sm:gap-y-6 sm:pt-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="border-l border-gold pl-3 sm:border-l-2 sm:pl-[18px]"
              >
                <h3 className="font-sans text-[13px] font-bold leading-tight text-marble sm:text-sm">
                  {p.title}
                </h3>
                <p className="mt-1 font-sans text-xs font-normal leading-[1.35] text-mist sm:text-sm sm:leading-5">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
