'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { MagneticButton } from '@/components/landing/magnetic-button'

const links = [
  { href: '#inicio', label: 'Início' },
  { href: '#areas', label: 'Áreas de Atuação' },
  { href: '#sobre', label: 'Sobre' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <div className="hidden border-b border-rule bg-ink md:flex md:h-10 md:items-center md:justify-between md:px-4">
        <p className="text-[13px] font-semibold tracking-label text-mist">
          OAB/PR 123.456 — Curitiba e Região Metropolitana
        </p>
        <div className="flex gap-4 text-[13px] font-semibold tracking-label text-mist">
          <Link href="#privacidade" className="transition hover:text-gold">
            Privacidade
          </Link>
          <Link href="#termos" className="transition hover:text-gold">
            Termos
          </Link>
        </div>
      </div>

      {/* Figma: nav 80px altura, px 16; mobile com logo + CONSULTA + menu */}
      <div className="glass-panel border-b border-white/[0.04] backdrop-blur-[6px] md:bg-[rgba(19,19,19,0.8)]">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-3 px-4">
          <Link href="#inicio" className="flex min-w-0 flex-col leading-none">
            <span className="font-serif text-2xl font-bold tracking-[-0.05em] text-gold md:text-2xl">
              VALENTE
            </span>
            <span className="pl-1 pt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-mist">
              Advocacia
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-end gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-semibold tracking-label transition ${
                  l.href === '#inicio' ? 'font-bold text-gold' : 'text-mist hover:text-gold'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <MagneticButton href="#contato" padding="header" className="bg-gold text-cocoa hover:bg-gold-muted">
              Consulta
            </MagneticButton>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <MagneticButton
              href="#contato"
              padding="header"
              className="shrink-0 bg-gold text-cocoa hover:bg-gold-muted"
            >
              Consulta
            </MagneticButton>
            <button
              type="button"
              className="relative flex size-11 shrink-0 items-center justify-center rounded border border-white/10"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`absolute block h-0.5 w-5 bg-marble transition-transform duration-300 ${
                  open ? 'translate-y-0 rotate-45' : '-translate-y-1.5'
                }`}
              />
              <span
                className={`absolute block h-0.5 w-5 bg-marble transition-opacity duration-300 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute block h-0.5 w-5 bg-marble transition-transform duration-300 ${
                  open ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'
                }`}
              />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel overflow-hidden border-b border-white/[0.06] md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    className="block py-3 text-sm font-semibold uppercase tracking-label text-mist hover:text-gold"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
