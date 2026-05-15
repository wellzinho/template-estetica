'use client'

import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    const lenis = new Lenis({
      duration: 1.12,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.05,
      syncTouch: true,
      /** Lets horizontal carousels (overflow-x) receive wheel/trackpad without fighting Lenis */
      allowNestedScroll: true,
    })

    document.documentElement.classList.add('lenis')

    lenis.on('scroll', ScrollTrigger.update)

    let alive = true
    const raf = (time: number) => {
      if (!alive) return
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === 'number') {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    })

    const onResize = () => {
      lenis.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      alive = false
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
      ScrollTrigger.scrollerProxy(document.documentElement, {})
    }
  }, [])

  return children
}
