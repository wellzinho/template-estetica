'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { figmaAssets } from '@/lib/figma-assets'
import { IconQuote } from '@/components/landing/icons'
import { MagneticButton } from '@/components/landing/magnetic-button'

const items = [
  {
    quote: [
      '"A visão estratégica do Dr. Valente foi decisiva para a conclusão da nossa fusão internacional.',
      'Um intelecto acima da média."',
    ],
    name: ['Ricardo', 'Mendes'],
    role: ['CEO |', 'INVESTGROUP', 'BRASIL'],
    img: figmaAssets.testimonialCeo,
    imgSizes: '48px',
  },
  {
    quote: [
      '"Segurança jurídica',
      'absoluta em momentos de crise. A equipe da Valente',
      'Advocacia atua com uma precisão cirúrgica."',
    ],
    name: ['Dra.', 'Beatriz', 'Santos'],
    role: ['DIRETORA', 'JURÍDICA |', 'TECHGLOBAL'],
    img: figmaAssets.testimonialCfo,
    imgSizes: '48px',
  },
  {
    quote: [
      '"A discrição e o pragmatismo são os pontos fortes. Recomendo para qualquer holding familiar que busque',
      'blindagem."',
    ],
    name: ['Marcos', 'Viana'],
    role: ['PRESIDENTE |', 'VIANA', 'HOLDINGS'],
    img: figmaAssets.testimonialHolding,
    imgSizes: '48px',
  },
] as const

type Item = (typeof items)[number]

const cardClassName =
  'flex min-h-[280px] w-[min(88vw,360px)] shrink-0 flex-col gap-4 rounded-[2px] border-l-2 border-gold bg-ink-quote px-4 pb-12 pt-10 md:min-h-0 md:w-auto md:px-[18px] md:pb-14 md:pt-12'

function TestimonialInner({ t }: { t: Item }) {
  return (
    <>
      <IconQuote className="h-[18px] w-[26px] text-gold" />
      <div className="space-y-1 font-sans text-base italic leading-relaxed text-marble">
        {t.quote.map((line) => (
          <p key={line.slice(0, 24)}>{line}</p>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-4 pt-2">
        <div className="relative size-12 overflow-hidden rounded-full bg-[#353534]">
          <Image src={t.img} alt="" fill className="object-cover" sizes={t.imgSizes} />
        </div>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-label text-marble">
            {t.name.map((n) => (
              <span key={n} className="block leading-tight">
                {n}
              </span>
            ))}
          </p>
          <p className="mt-1 text-[11px] font-normal uppercase leading-snug text-mist">
            {t.role.map((r) => (
              <span key={r} className="block">
                {r}
              </span>
            ))}
          </p>
        </div>
      </div>
    </>
  )
}

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.15, once: true })

  const loop = [...items, ...items] as Item[]

  return (
    <section ref={ref} className="bg-ink px-4 pb-8 pt-16 md:pb-12 md:pt-16">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 md:gap-16">
        <div className="flex flex-col gap-2 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-display text-[13px] font-semibold uppercase tracking-kicker text-gold"
          >
            Depoimentos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-tight text-marble"
          >
            Relatos de quem teve seus direitos respeitados
          </motion.h2>
        </div>

        {/* Mobile: carrossel infinito (motion-safe) ou rolagem horizontal (reduced motion) */}
        <div className="-mx-4 md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="hidden gap-6 overflow-x-auto overflow-y-hidden px-4 pb-2 motion-reduce:flex snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            tabIndex={0}
            aria-label="Depoimentos de clientes"
          >
            {items.map((t) => (
              <article key={t.name.join('-')} className={`${cardClassName} snap-center`}>
                <TestimonialInner t={t} />
              </article>
            ))}
          </motion.div>

          <div className="motion-reduce:hidden group/marquee relative overflow-hidden py-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ink to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink to-transparent"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="overflow-hidden"
            >
              <div className="flex w-max gap-6 pl-4 pr-4 group-hover/marquee:[animation-play-state:paused] motion-safe:animate-testimonials-marquee">
                {loop.map((t, i) => (
                  <article key={`${t.name.join('-')}-${i}`} className={cardClassName}>
                    <TestimonialInner t={t} />
                  </article>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Desktop: grade */}
        <div className="hidden grid-cols-3 gap-6 md:grid">
          {items.map((t, i) => (
            <motion.article
              key={t.name.join('-')}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={cardClassName}
            >
              <TestimonialInner t={t} />
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="flex justify-center"
        >
          <MagneticButton
            href="#contato"
            padding="hero"
            className="bg-gold text-cocoa hover:bg-gold-muted"
          >
            Agendar uma consulta
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
