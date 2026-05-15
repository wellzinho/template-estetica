'use client'

import { ProgressiveBlur } from '@/components/ui/progressive-blur'

/**
 * Progressive blur at the top and bottom of the viewport while scrolling,
 * following the [Magic UI Progressive Blur](https://magicui.design/docs/components/progressive-blur) pattern.
 * Sits below the sticky header (z-50) so navigation stays sharp.
 */
export function SiteViewportProgressiveBlur() {
  return (
    <>
      {/* Apenas `fixed` — nunca `relative` no mesmo nó (Tailwind pode deixar o último ganhar e o strip entra no fluxo, criando faixa vazia acima do header). */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-[min(22vh,180px)]">
        <ProgressiveBlur position="top" height="100%" className="h-full" />
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[45] h-[min(24vh,200px)]">
        <ProgressiveBlur position="bottom" height="100%" className="h-full" />
      </div>
    </>
  )
}
