'use client'

import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import { AnimatedList } from '@/components/ui/animated-list'
import { figmaAssets } from '@/lib/figma-assets'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const steps = [
  {
    n: '01',
    title: 'Imersão Total',
    body: 'Entendemos o seu negócio profundamente antes de sugerir a primeira peça jurídica.',
  },
  {
    n: '02',
    title: 'Engenharia de Risco',
    body: 'Modelamos cenários probabilísticos para garantir a melhor tomada de decisão executiva.',
  },
  {
    n: '03',
    title: 'Execução Cirúrgica',
    body: 'Protocolos rigorosos de acompanhamento e reporte direto ao board corporativo.',
  },
] as const

const stepMotion = {
  rest: { x: 0 },
  hover: { x: 3 },
}

export function MethodologySection() {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const section = root.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.meth-num').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.15, scale: 0.92 },
          {
            opacity: 0.22,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              scrub: 1.2,
              start: 'top 90%',
              end: 'top 40%',
            },
          },
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const stepBlock = (s: (typeof steps)[number]) => (
    <motion.div
      key={s.n}
      variants={stepMotion}
      initial="rest"
      whileHover={reducedMotion ? undefined : 'hover'}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="meth-step group/step flex gap-6 rounded-[2px] py-0.5 transition-colors duration-300 hover:bg-white/[0.02]"
    >
      <div className="meth-num flex shrink-0 font-serif text-[clamp(3rem,10vw,4rem)] font-medium leading-none text-gold opacity-20 transition-opacity duration-300 group-hover/step:opacity-[0.28]">
        {s.n}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-[1.65rem] font-medium text-marble transition-colors duration-300 group-hover/step:text-gold/90 md:text-[2rem]">
          {s.title}
        </h3>
        <p className="max-w-md text-base leading-relaxed text-mist transition-colors duration-300 group-hover/step:text-marble/90">
          {s.body}
        </p>
      </div>
    </motion.div>
  )

  return (
    <section ref={root} className="bg-ink-panel py-16">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-24 xl:gap-32">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full max-w-xl flex-col gap-2"
        >
          <p className="font-display text-[13px] font-semibold uppercase tracking-kicker text-gold">
            Nosso diferencial
          </p>
          <h2 className="font-serif text-[clamp(1.85rem,5vw,3rem)] font-semibold leading-tight text-marble">
            Metodologia estratégica de alta performance
          </h2>
          {reducedMotion ? (
            <div className="mt-6 flex flex-col gap-12">{steps.map((s) => stepBlock(s))}</div>
          ) : (
            <AnimatedList className="mt-6 w-full items-stretch gap-12" delay={520} reverseStack={false}>
              {steps.map((s) => stepBlock(s))}
            </AnimatedList>
          )}
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="meth-visual-wrap group/img relative mx-auto mt-4 w-full min-h-0 max-w-xl shrink-0 overflow-hidden rounded-[2px] border border-rule transition-[border-color,box-shadow] duration-500 ease-out hover:border-gold/25 hover:shadow-[0_0_0_1px_rgba(230,195,100,0.08)] lg:mx-0 lg:mt-0 lg:min-w-0 lg:max-w-none"
        >
          {/*
            Sem parallax GSAP aqui: o translateY deixava a imagem “subida” e o bg-ink-card aparecia em baixo.
            aspect-[3/4] + fill + object-cover preenchem o placeholder em qualquer largura.
          */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink-card">
            <motion.div
              className="absolute inset-0 origin-center"
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={figmaAssets.methodology}
                alt="Reunião estratégica entre executivos"
                fill
                sizes="(max-width: 1023px) min(100vw - 2rem, 36rem), (min-width: 1280px) 560px, 45vw"
                className="object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-white mix-blend-saturation" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
