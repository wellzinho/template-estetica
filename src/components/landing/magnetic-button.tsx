import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Padding = 'hero' | 'header' | 'default'

type Common = {
  children: ReactNode
  className?: string
  /** Padding interno alinhado ao Figma (hero: 40×20, header: 24×12, default: 32×16). */
  padding?: Padding
}

type MagneticAsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { href?: undefined }

type MagneticAsLink = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string }

export type MagneticButtonProps = MagneticAsButton | MagneticAsLink

const paddingClass: Record<Padding, string> = {
  hero: 'px-10 py-5',
  header: 'px-6 py-3',
  default: 'px-8 py-4',
}

export function MagneticButton(props: MagneticButtonProps) {
  const { children, className = '', padding = 'default', ...rest } = props

  const merged = `${className} inline-flex rounded-[2px] text-[13px] font-bold uppercase tracking-[0.05em] transition-colors duration-300 ease-outExpo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.99]`

  const inner = (
    <span
      className={`inline-flex w-full items-center justify-center text-center ${paddingClass[padding]}`}
    >
      {children}
    </span>
  )

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, ...a } = rest
    return (
      <a href={href} className={merged} {...a}>
        {inner}
      </a>
    )
  }

  const btn = rest as Omit<MagneticAsButton, 'children' | 'className' | 'padding'>
  return (
    <button type={btn.type ?? 'button'} className={merged} {...btn}>
      {inner}
    </button>
  )
}
