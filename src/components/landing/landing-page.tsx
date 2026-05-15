'use client'

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { HeroBackgroundVideo } from '@/components/landing/hero-background-video'
import { BeforeAfterSlider } from '@/components/ui/before-after-slider'
import { figmaAssets } from '@/lib/figma-assets'

const navItems = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#tratamentos', label: 'Tratamentos' },
  { href: '#resultados', label: 'Resultados' },
  { href: '#depoimentos', label: 'Depoimentos' },
]

const treatments = [
  {
    title: 'Protocolo Luminosidade',
    copy: 'Pele iluminada e uniforme em 4 sessões.',
    detail: 'Vitaminas, ácidos inteligentes e luz fria para lapidar textura sem agressão.',
    image: figmaAssets.treatments.luminosidade,
  },
  {
    title: 'Peeling de Cristal',
    copy: 'Renovação celular e textura impecável.',
    detail: 'Esfoliação controlada, ativos calmantes e acabamento acetinado.',
    image: figmaAssets.treatments.peeling,
  },
  {
    title: 'Drenagem Linfática Premium',
    copy: 'Desinchada, leve e revigorada.',
    detail: 'Manobras precisas para redesenhar contornos e recuperar leveza.',
    image: figmaAssets.treatments.drenagem,
  },
  {
    title: 'Bioestimulação Facial',
    copy: 'Colágeno que rejuvenesce de dentro para fora.',
    detail: 'Estímulo progressivo para firmeza, viço e naturalidade.',
    image: figmaAssets.treatments.bioestimulacao,
  },
]

const resultItems = [
  {
    before: figmaAssets.results.luminosidade.before,
    after: figmaAssets.results.luminosidade.after,
    caption: 'Protocolo Luminosidade · 4 sessões',
  },
  {
    before: figmaAssets.results.botox.before,
    after: figmaAssets.results.botox.after,
    caption: 'Botox · 4 meses depois',
  },
] as const

const stats = [
  ['+2.400', 'Atendimentos'],
  ['9 anos', 'De experiência'],
  ['97%', 'De satisfação'],
  ['15', 'Protocolos exclusivos'],
]

const testimonials = [
  {
    quote: 'A Lívia é simplesmente outra dimensão. Minha pele nunca esteve tão viva. Atendimento impecável.',
    name: 'Camila S.',
    city: 'São Paulo',
    initial: 'C',
  },
  {
    quote: 'Sofisticada, técnica e humana. O resultado do antiaging foi sutil e absurdamente natural.',
    name: 'Marina R.',
    city: 'Curitiba',
    initial: 'M',
  },
  {
    quote: 'Vale cada minuto da viagem. O studio é um refúgio e os protocolos são cirúrgicos.',
    name: 'Beatriz L.',
    city: 'Balneário Camboriú',
    initial: 'B',
  },
  {
    quote: 'Tirou minhas manchas em 6 sessões. Recuperei a confiança de sair sem maquiagem.',
    name: 'Patrícia M.',
    city: 'Curitiba',
    initial: 'P',
  },
]

const engineeringSteps = [
  ['01', 'Consulta gratuita pelo WhatsApp'],
  ['02', 'Avaliação presencial da pele'],
  ['03', 'Protocolo 100% personalizado'],
  ['04', 'Acompanhamento e resultado'],
]

const softEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3)
}

function animateScrollLeft(
  track: HTMLDivElement,
  targetLeft: number,
  duration: number,
  onComplete: () => void,
) {
  const startLeft = track.scrollLeft
  const distance = targetLeft - startLeft

  if (Math.abs(distance) < 1) {
    onComplete()
    return
  }

  const startTime = performance.now()

  function step(now: number) {
    const progress = Math.min((now - startTime) / duration, 1)
    track.scrollLeft = startLeft + distance * easeOutCubic(progress)

    if (progress < 1) {
      requestAnimationFrame(step)
      return
    }

    track.scrollLeft = targetLeft
    onComplete()
  }

  requestAnimationFrame(step)
}

function getItemOffsetLeftInTrack(track: HTMLDivElement, item: HTMLElement) {
  return item.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft
}

/** Inner row (`w-max`) when present — reliable horizontal overflow on desktop (Apple-style carousel). */
function getCarouselItemsParent(track: HTMLDivElement): HTMLElement {
  return (track.querySelector('[data-carousel-row]') as HTMLElement) ?? track
}

function getCarouselActiveIndex(track: HTMLDivElement | null) {
  if (!track) return 0

  const root = getCarouselItemsParent(track)
  const itemCount = root.children.length
  if (itemCount === 0) return 0

  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
  const edgeThreshold = 16

  if (maxScroll > edgeThreshold && track.scrollLeft >= maxScroll - edgeThreshold) {
    return itemCount - 1
  }

  if (track.scrollLeft <= edgeThreshold) {
    return 0
  }

  const center = track.scrollLeft + track.clientWidth / 2
  let closestIndex = 0
  let closestDistance = Number.POSITIVE_INFINITY

  Array.from(root.children).forEach((child, childIndex) => {
    const element = child as HTMLElement
    const itemLeft = getItemOffsetLeftInTrack(track, element)
    const itemCenter = itemLeft + element.offsetWidth / 2
    const distance = Math.abs(center - itemCenter)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = childIndex
    }
  })

  return closestIndex
}

function getCarouselScrollLeft(track: HTMLDivElement, index: number) {
  const root = getCarouselItemsParent(track)
  const item = root.children[index] as HTMLElement | undefined
  if (!item) return 0

  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
  const left = getItemOffsetLeftInTrack(track, item)
  const centered = left - (track.clientWidth - item.offsetWidth) / 2

  return Math.min(maxScroll, Math.max(0, centered))
}

function scrollCarouselByDirection(
  track: HTMLDivElement | null,
  direction: 'next' | 'prev',
  itemCount: number,
  isScrollingRef: { current: boolean },
  activeIndex: number,
) {
  if (!track || itemCount === 0 || isScrollingRef.current) return -1

  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
  const currentIndex = maxScroll <= 16 ? activeIndex : getCarouselActiveIndex(track)
  let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
  const wrappingForward = nextIndex >= itemCount
  const wrappingBackward = nextIndex < 0

  if (wrappingForward) nextIndex = 0
  if (wrappingBackward) nextIndex = itemCount - 1

  const root = getCarouselItemsParent(track)
  const item = root.children[nextIndex] as HTMLElement | undefined
  if (!item) return nextIndex

  const targetLeft = getCarouselScrollLeft(track, nextIndex)
  const duration = wrappingForward || wrappingBackward ? 750 : 500

  isScrollingRef.current = true
  track.style.scrollSnapType = 'none'

  const finish = () => {
    track.style.removeProperty('scroll-snap-type')
    isScrollingRef.current = false
  }

  animateScrollLeft(track, targetLeft, duration, finish)

  return nextIndex
}

/** Bounded carousel: arrows disable at edges (same interaction idea as Apple Cards Carousel). */
function getCarouselScrollAvailability(track: HTMLDivElement | null) {
  if (!track) return { canPrev: false, canNext: false }
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
  const left = track.scrollLeft
  /** Lenis/layout can leave 1–4px overflow; tratamentos spans wider, depoimentos can sit barely over the edge */
  const pad = 0.75
  const hasOverflow = maxScroll > pad
  return {
    canPrev: hasOverflow && left > pad,
    canNext: hasOverflow && left < maxScroll - pad,
  }
}

function navigateCarouselClamped(
  track: HTMLDivElement | null,
  direction: 'next' | 'prev',
  itemCount: number,
  currentIndex: number,
  isScrollingRef: { current: boolean },
  onNavigateComplete?: () => void,
): number {
  if (!track || itemCount === 0 || isScrollingRef.current) return -1

  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
  if (maxScroll < 0.5) return -1

  const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1

  if (nextIndex < 0 || nextIndex >= itemCount) return -1

  const root = getCarouselItemsParent(track)
  const item = root.children[nextIndex] as HTMLElement | undefined
  if (!item) return -1

  const targetLeft = getCarouselScrollLeft(track, nextIndex)

  if (Math.abs(track.scrollLeft - targetLeft) < 8) {
    onNavigateComplete?.()
    return nextIndex
  }

  isScrollingRef.current = true
  track.style.scrollSnapType = 'none'

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const finish = () => {
    track.style.removeProperty('scroll-snap-type')
    isScrollingRef.current = false
    onNavigateComplete?.()
  }

  if (reduced) {
    track.scrollLeft = targetLeft
    finish()
    return nextIndex
  }

  animateScrollLeft(track, targetLeft, 520, finish)

  return nextIndex
}

function Monogram() {
  return (
    <span className="inline-flex flex-col items-center leading-none text-[#fbfaf8]">
      <span className="font-display text-2xl tracking-[0.18em]">LM</span>
      <span className="mt-1 h-px w-8 bg-[#fbfaf8]" />
    </span>
  )
}

function MagneticLink({
  href,
  children,
  variant = 'solid',
  className = '',
}: {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
  className?: string
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 210, damping: 18 })
  const springY = useSpring(y, { stiffness: 210, damping: 18 })

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
  }

  const variantClass =
    variant === 'outline'
      ? 'border-[3px] border-[#b29267] bg-transparent text-white hover:bg-[#b29267]/20'
      : variant === 'ghost'
        ? 'border border-white/15 bg-white/10 text-white hover:border-[#b29267]/70 hover:bg-[#b29267]/20'
        : 'border border-[#b29267] bg-[#b29267] text-white shadow-[0_18px_50px_rgba(178,146,103,0.32)] hover:bg-[#c6a477]'

  return (
    <motion.a
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`group relative inline-flex overflow-hidden rounded-full px-8 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.2em] transition duration-500 ${variantClass} ${className}`}
    >
      <motion.span
        aria-hidden
        className="absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-white/30 blur-sm"
        initial={false}
        animate={{ x: ['0%', '320%'] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.a>
  )
}

function SectionLabel({ children, tone = 'dark' }: { children: ReactNode; tone?: 'dark' | 'light' | 'gold' }) {
  const color = tone === 'light' ? 'text-white/65' : tone === 'gold' ? 'text-[#b29267]' : 'text-[#1a1a1d]'
  return <p className={`text-[11px] font-medium uppercase tracking-[0.4em] ${color}`}>{children}</p>
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CarouselButton({
  label,
  direction,
  onClick,
  tone = 'dark',
  variant = 'default',
  disabled = false,
}: {
  label: string
  direction: 'previous' | 'next'
  onClick: () => void
  tone?: 'dark' | 'light'
  variant?: 'default' | 'figma'
  disabled?: boolean
}) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight
  const disabledClass = 'disabled:pointer-events-none disabled:opacity-40'

  if (variant === 'figma') {
    return (
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={`grid size-12 place-items-center rounded-full bg-white text-[#1a1a1d] transition duration-300 hover:bg-[#f3e9e1] ${disabledClass}`}
      >
        <Icon className="size-5" />
      </button>
    )
  }

  const toneClass =
    tone === 'light'
      ? 'border-white/20 bg-white/10 text-white hover:border-[#b29267] hover:bg-[#b29267]'
      : 'border-[#1a1a1d]/15 bg-[#1a1a1d] text-white hover:border-[#b29267] hover:bg-[#b29267]'

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid size-12 place-items-center rounded-full border shadow-[0_14px_35px_rgba(26,26,29,0.14)] transition duration-300 ${toneClass} ${disabledClass}`}
    >
      <Icon className="size-5" />
    </button>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#1a1a1d]/90 text-[#fbfaf8] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#inicio" aria-label="Lívia Monteiro" className="group">
          <Monogram />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-[12px] uppercase tracking-[0.22em] text-[#fbfaf8]/85 transition hover:text-white"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#b29267] transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <MagneticLink href="#contato" className="px-5 py-3 text-[10px]">
            Agendar agora
          </MagneticLink>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
          className="relative grid size-12 place-items-center rounded-full border border-white/15 lg:hidden"
        >
          <span className={`absolute h-px w-5 bg-white transition ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
          <span className={`absolute h-px w-5 bg-white transition ${open ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`absolute h-px w-5 bg-white transition ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
          <span className="sr-only">Abrir menu</span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="menu-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: softEase }}
            className="overflow-hidden border-t border-white/10 bg-[#1a1a1d]"
          >
            <div className="flex flex-col px-5 py-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.32, ease: softEase }}
                  className="border-b border-white/10 py-4 text-sm uppercase tracking-[0.25em]"
                >
                  {item.label}
                </motion.a>
              ))}
              <MagneticLink href="#contato" className="mt-5 justify-center">
                Agendar agora
              </MagneticLink>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14])
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const mistOpacity = useTransform(scrollYProgress, [0, 0.65], [0.95, 0.24])

  return (
    <section ref={ref} id="inicio" className="relative isolate min-h-[960px] overflow-hidden pt-20 md:min-h-screen">
      <motion.div className="absolute inset-0 -z-20" style={{ scale: imageScale, y: imageY }}>
        <HeroBackgroundVideo className="size-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-black/30" />
      <motion.div
        aria-hidden
        style={{ opacity: mistOpacity }}
        className="grain-overlay pointer-events-none absolute inset-0 -z-[5]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-[18%] h-72 w-72 rounded-full bg-[#d4b5a0]/25 blur-3xl"
        animate={{ scale: [1, 1.28, 1], opacity: [0.35, 0.62, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto flex min-h-[calc(100svh-80px)] max-w-[1440px] items-center px-5 py-16 sm:px-8 lg:px-10">
        <motion.div
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 36, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: softEase }}
          className="ml-auto w-full max-w-[842px] rounded-[32px] bg-[linear-gradient(120deg,rgba(108,80,62,0.62),rgba(105,87,72,0.92))] p-6 shadow-[0_35px_120px_rgba(0,0,0,0.34)] backdrop-blur-md sm:p-10"
        >
          <div className="flex max-w-[762px] flex-col gap-6">
            <SectionLabel tone="light">Lívia Monteiro · Estética avançada</SectionLabel>
            <h1 className="font-display text-[clamp(3.4rem,8vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.02em] text-white md:text-[60px] md:leading-[63px]">
              Ciência, precisão e alta performance em estética
            </h1>
            <p className="max-w-[620px] text-lg font-light leading-[1.65] text-white/90">
              Protocolos exclusivos de estética avançada para quem exige o melhor resultado.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
              <MagneticLink href="#contato">Agendar minha consulta</MagneticLink>
              <MagneticLink href="#tratamentos" variant="outline">
                Conheça os tratamentos ↓
              </MagneticLink>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-white/70 md:flex"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        Role para esculpir
        <span className="h-14 w-px bg-gradient-to-b from-white/80 to-transparent" />
      </motion.div>
    </section>
  )
}

function Treatments() {
  const trackRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(0)
  const isScrollingRef = useRef(false)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const syncTreatmentScroll = useCallback(() => {
    const track = trackRef.current
    if (!track || isScrollingRef.current) return
    const { canPrev, canNext } = getCarouselScrollAvailability(track)
    setCanScrollPrev(canPrev)
    setCanScrollNext(canNext)
    activeIndexRef.current = getCarouselActiveIndex(track)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    syncTreatmentScroll()
    const ro = new ResizeObserver(() => syncTreatmentScroll())
    ro.observe(track)
    return () => ro.disconnect()
  }, [syncTreatmentScroll])

  const scrollTreatment = useCallback(
    (direction: 'next' | 'prev') => {
      const track = trackRef.current
      if (!track) return
      const next = navigateCarouselClamped(
        track,
        direction,
        treatments.length,
        activeIndexRef.current,
        isScrollingRef,
        () => requestAnimationFrame(syncTreatmentScroll),
      )
      if (next >= 0) activeIndexRef.current = next
    },
    [syncTreatmentScroll],
  )

  return (
    <section id="tratamentos" className="overflow-hidden bg-[#d4b5a0] px-5 py-20 sm:px-8 lg:px-10">
      <motion.div className="mx-auto flex w-full min-w-0 max-w-[1440px] flex-col gap-8">
        <div className="flex w-full min-w-0 flex-col gap-8 lg:flex-row lg:items-center lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.75, ease: softEase }}
            className="w-full shrink-0 lg:w-[544px]"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#1a1a1d] lg:text-base lg:tracking-[0.275em] lg:text-white">
              Tratamentos
            </p>
            <h2 className="mt-4 font-display text-[clamp(3rem,6vw,7rem)] font-semibold leading-[0.95] tracking-[-0.48px] text-[#1a1a1d] lg:text-[56px] lg:leading-[60px]">
              Procedimentos desenhados com precisão
            </h2>
          </motion.div>

          <div
            ref={trackRef}
            data-lenis-prevent=""
            onScroll={syncTreatmentScroll}
            className="no-scrollbar -mx-5 min-w-0 flex-1 overflow-x-scroll overscroll-x-auto px-[max(1.25rem,calc((100%-min(82vw,400px))/2))] pb-3 max-lg:snap-x max-lg:snap-mandatory sm:-mx-8 sm:px-[max(2rem,calc((100%-min(82vw,400px))/2))] lg:mx-0 lg:snap-none lg:px-0"
          >
            <div data-carousel-row className="flex w-max min-w-full flex-nowrap gap-6 lg:gap-10">
            {treatments.map((treatment, index) => (
              <motion.article
                key={treatment.title}
                initial={{ opacity: 0, y: 34, rotate: index % 2 ? 1.8 : -1.8 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ delay: index * 0.08, duration: 0.78, ease: softEase }}
                className="w-[82vw] max-w-[400px] shrink-0 max-lg:snap-center overflow-hidden rounded-2xl bg-white sm:w-[400px] lg:shadow-none"
              >
                <div className="group/image relative h-[425px] overflow-hidden rounded-t-2xl bg-[#f3e9e1]">
                  <img
                    src={treatment.image}
                    alt=""
                    className="size-full object-cover transition duration-700 group-hover/image:scale-110"
                  />
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1a1d]/70 via-[#1a1a1d]/25 to-transparent opacity-0 transition duration-500 group-hover/image:opacity-100"
                  />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-5 rounded-2xl border border-white/15 bg-[#1a1a1d]/92 p-4 opacity-0 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-500 group-hover/image:translate-y-0 group-hover/image:opacity-100 supports-[backdrop-filter]:bg-[#1a1a1d]/88">
                    <p className="text-pretty text-sm font-medium leading-[1.6] text-[#fbfaf8]">{treatment.detail}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 px-2 pb-4 pt-3">
                  <h3 className="font-display text-2xl leading-8 tracking-[-0.24px] text-[#1a1a1d]">{treatment.title}</h3>
                  <p className="text-lg font-light leading-5 text-[#1a1a1d]/70">{treatment.copy}</p>
                </div>
              </motion.article>
            ))}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-6">
          <CarouselButton
            label="Tratamento anterior"
            direction="previous"
            variant="figma"
            disabled={!canScrollPrev}
            onClick={() => scrollTreatment('prev')}
          />
          <CarouselButton
            label="Próximo tratamento"
            direction="next"
            variant="figma"
            disabled={!canScrollNext}
            onClick={() => scrollTreatment('next')}
          />
        </div>
      </motion.div>
    </section>
  )
}

function BeforeAfterFrame({
  before,
  after,
  caption,
}: {
  before: string
  after: string
  caption: string
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.9, ease: softEase }}
      className="mx-auto w-full max-w-[1080px] shrink-0 snap-center overflow-hidden rounded-[28px] bg-[#353535] shadow-[0_32px_90px_rgba(0,0,0,0.18)] md:rounded-[40px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[28px] bg-[#22180f] md:aspect-[16/10] md:rounded-t-[40px]">
        <BeforeAfterSlider beforeImage={before} afterImage={after} />
      </div>
      <figcaption className="p-7 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-white/60 md:p-10">
        {caption}
      </figcaption>
    </motion.figure>
  )
}

function Results() {
  const trackRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)
  const [, setActiveIndex] = useState(0)

  const scrollResult = useCallback(
    (direction: 'next' | 'prev') => {
      setActiveIndex((current) => {
        const next = scrollCarouselByDirection(
          trackRef.current,
          direction,
          resultItems.length,
          isScrollingRef,
          current,
        )
        return next >= 0 ? next : current
      })
    },
    [],
  )

  const syncActiveResult = useCallback(() => {
    if (isScrollingRef.current) return
    setActiveIndex(getCarouselActiveIndex(trackRef.current))
  }, [])

  return (
    <section id="resultados" className="bg-[#f3e9e1] px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12">
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: softEase }}
            className="max-w-[820px]"
          >
            <SectionLabel>Resultados</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2.9rem,6vw,6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-[#1a1a1d] lg:text-[48px] lg:leading-[60px]">
              Confie em quem entende e ame o resultado
            </h2>
          </motion.div>

        <div
          ref={trackRef}
          data-lenis-prevent=""
          onScroll={syncActiveResult}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[max(1.25rem,calc((100%-min(82vw,1080px))/2))] pb-3 sm:-mx-8 sm:px-[max(2rem,calc((100%-min(82vw,1080px))/2))] lg:mx-0 lg:px-0"
        >
          {resultItems.map((item) => (
            <BeforeAfterFrame key={item.caption} {...item} />
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <CarouselButton
            label="Resultado anterior"
            direction="previous"
            onClick={() => scrollResult('prev')}
          />
          <CarouselButton
            label="Próximo resultado"
            direction="next"
            onClick={() => scrollResult('next')}
          />
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="bg-[#1a1a1d] px-5 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1152px] grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map(([value, label], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07, duration: 0.55, ease: softEase }}
            className="group text-center"
          >
            <p className="font-display text-4xl font-semibold leading-9 text-white transition duration-500 group-hover:text-[#d4b5a0]">
              {value}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#fbfaf8]/60">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="sobre" className="bg-[#fbfaf8] px-5 py-16 text-[#1a1a1d] sm:px-8 lg:px-10 lg:py-[72px]">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.85, ease: softEase }}
          className="relative min-h-[520px] overflow-hidden rounded-[32px] lg:min-h-[670px]"
        >
          <img src={figmaAssets.professional} alt="Lívia Monteiro" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1d]/25 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.85, ease: softEase }}
          className="flex items-center"
        >
          <div className="max-w-[640px]">
            <SectionLabel tone="gold">A profissional</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] leading-[1.05] tracking-[-0.02em] lg:text-[48px] lg:leading-[60px]">
              Lívia Monteiro
            </h2>
            <p className="mt-4 text-sm uppercase leading-5 tracking-[0.18em] text-[#1a1a1d]/60">
              Estética facial avançada · harmonização natural · protocolos antiaging
            </p>
            <p className="mt-8 text-[17px] font-light leading-[1.65] text-[#1a1a1d]/75">
              Formada em Estética e Cosmética pela PUCPR, com especialização em Dermofuncional e Harmonização Orofacial.
              Há 9 anos transformo peles e autoestima com protocolos personalizados, sem exageros e sem perder a naturalidade.
            </p>
            <div className="mt-12">
              <MagneticLink href="#contato">Agendar minha consulta</MagneticLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(0)
  const isScrollingRef = useRef(false)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const syncTestimonialScroll = useCallback(() => {
    const track = trackRef.current
    if (!track || isScrollingRef.current) return
    const { canPrev, canNext } = getCarouselScrollAvailability(track)
    setCanScrollPrev(canPrev)
    setCanScrollNext(canNext)
    activeIndexRef.current = getCarouselActiveIndex(track)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    syncTestimonialScroll()
    const ro = new ResizeObserver(() => syncTestimonialScroll())
    ro.observe(track)
    return () => ro.disconnect()
  }, [syncTestimonialScroll])

  const scrollTestimonial = useCallback(
    (direction: 'next' | 'prev') => {
      const track = trackRef.current
      if (!track) return
      const next = navigateCarouselClamped(
        track,
        direction,
        testimonials.length,
        activeIndexRef.current,
        isScrollingRef,
        () => requestAnimationFrame(syncTestimonialScroll),
      )
      if (next >= 0) activeIndexRef.current = next
    },
    [syncTestimonialScroll],
  )

  return (
    <section id="depoimentos" className="overflow-hidden bg-[#353535] px-5 py-20 sm:px-8 lg:px-10">
      <motion.div className="mx-auto flex w-full min-w-0 max-w-[1440px] flex-col gap-10 lg:gap-14">
        <div className="flex w-full min-w-0 flex-col gap-8 lg:flex-row lg:items-center lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.75, ease: softEase }}
            className="w-full shrink-0 lg:w-[544px]"
          >
            <p className="text-[11px] font-normal uppercase tracking-[0.4em] text-white/60">Depoimentos</p>
            <h2 className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] leading-[1.05] tracking-[-0.48px] text-[#fbfaf8]/60 lg:text-[48px] lg:leading-[60px]">
              A confiança de quem <span className="italic text-[#fbfaf8]/80">já viveu</span>
            </h2>
          </motion.div>

          <div
            ref={trackRef}
            data-lenis-prevent=""
            onScroll={syncTestimonialScroll}
            className="no-scrollbar -mx-5 min-w-0 flex-1 overflow-x-scroll overscroll-x-auto px-[max(1.25rem,calc((100%-min(82vw,380px))/2))] pb-3 max-lg:snap-x max-lg:snap-mandatory sm:-mx-8 sm:px-[max(2rem,calc((100%-min(82vw,380px))/2))] lg:mx-0 lg:snap-none lg:px-0"
          >
            <div data-carousel-row className="flex w-max min-w-full flex-nowrap gap-6 lg:gap-10">
          {testimonials.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="flex h-[262px] w-[82vw] max-w-[380px] shrink-0 max-lg:snap-center flex-col justify-between rounded-2xl border border-[#1a1a1d] bg-[#fbfaf8] p-[29px] sm:w-[380px]"
            >
              <div>
                <div className="flex items-center gap-1 text-[#b29267]">
                  {'★★★★★'.split('').map((star, starIndex) => (
                    <span key={starIndex}>{star}</span>
                  ))}
                  <span className="pl-3 text-[10px] uppercase tracking-[0.2em] text-[#1a1a1d]">Google</span>
                </div>
                <p className="mt-5 font-display text-lg leading-[1.62] text-[#1a1a1d] lg:text-[18px] lg:leading-[29.25px]">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-8 lg:pt-0">
                <span className="grid size-10 place-items-center rounded-full bg-[#b29267]/20 font-display text-[#b29267]">
                  {item.initial}
                </span>
                <span>
                  <span className="block text-sm text-[#1a1a1d]">{item.name}</span>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-[#1a1a1d]/50">{item.city}</span>
                </span>
              </div>
            </article>
          ))}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-6">
          <CarouselButton
            label="Depoimento anterior"
            direction="previous"
            variant="figma"
            disabled={!canScrollPrev}
            onClick={() => scrollTestimonial('prev')}
          />
          <CarouselButton
            label="Próximo depoimento"
            direction="next"
            variant="figma"
            disabled={!canScrollNext}
            onClick={() => scrollTestimonial('next')}
          />
        </div>
      </motion.div>
    </section>
  )
}

function Engineering() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#fbfaf8] px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center lg:flex-row lg:gap-0">
        <div className="relative z-0 -mx-5 -mb-[186px] h-[500px] w-[calc(100%+2.5rem)] shrink-0 overflow-hidden opacity-80 mix-blend-luminosity sm:-mx-8 sm:w-[calc(100%+4rem)] lg:hidden">
          <img src={figmaAssets.engineering} alt="" className="size-full object-cover" />
        </div>

        <motion.div
          style={{ y: imageY, rotate }}
          className="relative z-0 hidden h-[941px] w-full max-w-[683px] overflow-hidden rounded-[32px] opacity-80 mix-blend-luminosity lg:block lg:translate-x-12"
        >
          <img src={figmaAssets.engineering} alt="" className="size-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.9, ease: softEase }}
          className="relative z-10 flex w-full max-w-[350px] flex-col gap-6 rounded-[32px] bg-[linear-gradient(112.04deg,rgba(45,38,29,0.8)_2.78%,rgb(42,35,26)_94.31%)] px-4 py-8 lg:max-w-[720px] lg:gap-14 lg:bg-[linear-gradient(113deg,rgba(45,38,29,0.88),rgb(42,35,26))] lg:p-20 lg:shadow-[0_40px_120px_rgba(34,24,15,0.32)] lg:-ml-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: softEase }}
            className="flex flex-col"
          >
            <p className="text-xs font-normal uppercase tracking-[0.37em] text-white lg:text-[11px] lg:font-medium lg:tracking-[0.4em] lg:text-white/65">
              Como funciona
            </p>
            <h2 className="font-display text-[24px] leading-[60px] tracking-[-0.48px] text-white lg:text-[48px]">
              Um caminho <span className="italic">sereno</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: softEase }}
            className="flex flex-col gap-4 lg:gap-12 lg:pl-12"
          >
            {engineeringSteps.map(([number, title], index) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.58, ease: softEase }}
                className="group flex items-center gap-2 lg:relative"
              >
                <span className="grid shrink-0 place-items-center rounded-full bg-[#b29267] px-4 font-display text-base leading-10 text-white transition duration-500 group-hover:scale-110 group-hover:bg-[#d4b5a0] lg:absolute lg:-left-[60px] lg:top-0 lg:min-w-10 lg:px-2 lg:text-[36px]">
                  {number}
                </span>
                <h3 className="font-display text-base leading-[41.25px] text-white lg:text-[30px]">{title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section id="contato" className="relative overflow-hidden px-5 py-24 sm:px-8 lg:px-10 lg:py-40">
      <img src={figmaAssets.cta} alt="" className="absolute inset-0 size-full scale-105 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#cbb7a7]/15 via-[rgba(84,67,53,0.62)] to-[#22180f]" />
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.85, ease: softEase }}
        className="relative mx-auto flex max-w-[704px] flex-col items-center rounded-2xl bg-white/15 px-6 py-10 text-center shadow-[0_34px_100px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:px-10"
      >
        <h2 className="font-display text-[clamp(3.5rem,8vw,8rem)] leading-[0.94] tracking-[-0.02em] text-[#1a1a1d] lg:text-[80px] lg:leading-[75px]">
          Pronta para
          <br />
          transformar sua pele?
        </h2>
        <p className="mt-6 max-w-[448px] text-lg leading-7 text-white">
          Vagas limitadas por semana. Agende agora sua consulta de avaliação.
        </p>
        <div className="mt-8">
          <MagneticLink href="https://wa.me/5541999999999">Agendar minha consulta</MagneticLink>
        </div>
        <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-white">Studio Lívia Monteiro · Batel, Curitiba — PR</p>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#22180f] px-5 text-[#fbfaf8] sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1152px] flex-col items-center px-0 py-16 text-center">
        <Monogram />
        <p className="mt-4 font-display text-xl">Lívia Monteiro</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-[#cbb394]">Estética avançada</p>
        <nav className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-4">
          {['Tratamentos', 'Sobre', 'Contato', 'Instagram'].map((item) => (
            <a key={item} href={item === 'Instagram' ? '#' : `#${item.toLowerCase()}`} className="text-xs uppercase tracking-[0.25em] text-[#fbfaf8]/80 transition hover:text-[#d4b5a0]">
              {item}
            </a>
          ))}
        </nav>
        <div className="mt-7 flex gap-5">
          <a href="#" aria-label="Instagram" className="grid size-10 place-items-center rounded-full border border-[#fbfaf8]/20 transition hover:border-[#b29267] hover:bg-[#b29267]/20">
            <img src={figmaAssets.icons.instagram} alt="" className="size-4" />
          </a>
          <a href="https://wa.me/5541999999999" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-full border border-[#fbfaf8]/20 transition hover:border-[#b29267] hover:bg-[#b29267]/20">
            <img src={figmaAssets.icons.whatsapp} alt="" className="size-4" />
          </a>
        </div>
        <div className="mt-11 w-full border-t border-[#fbfaf8]/10 pt-8 text-[11px] uppercase tracking-[0.2em]">
          <p>CREFITO-8 / 123456-E</p>
          <p className="mt-1">© 2026 Lívia Monteiro Estética Avançada · Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-[#fbfaf8] text-[#1a1a1d]" style={{ '--gold': '#b29267' } as CSSProperties}>
      <Header />
      <main>
        <Hero />
        <Treatments />
        <Results />
        <Stats />
        <About />
        <Testimonials />
        <Engineering />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
