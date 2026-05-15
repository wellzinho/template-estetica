'use client'

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react'

export interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
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

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Antes',
  afterLabel = 'Depois',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const percentage = ((clientX - rect.left) / rect.width) * 100
    setSliderPosition(Math.min(100, Math.max(0, percentage)))
  }, [])

  const startDrag = useCallback(
    (clientX: number) => {
      setIsDragging(true)
      setHasInteracted(true)
      updatePosition(clientX)
    },
    [updatePosition],
  )

  const stopDrag = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const onPointerMove = (event: PointerEvent) => updatePosition(event.clientX)
    const onPointerUp = () => stopDrag()

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [isDragging, stopDrag, updatePosition])

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={`Comparador antes e depois: ${beforeLabel} e ${afterLabel}`}
      className={`relative size-full touch-none select-none overflow-hidden cursor-ew-resize ${className}`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        startDrag(event.clientX)
      }}
      onPointerMove={(event) => {
        if (!isDragging) return
        updatePosition(event.clientX)
      }}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      <div className="absolute inset-0">
        <img
          src={afterImage}
          alt={afterLabel}
          draggable={false}
          className="size-full object-cover object-center"
        />
        <div className="absolute right-4 top-4 rounded-full bg-white/85 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-[#1a1a1d] backdrop-blur md:right-8 md:top-8">
          {afterLabel}
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          draggable={false}
          className="size-full object-cover object-center"
        />
        <div className="absolute left-4 top-4 rounded-full bg-[#1a1a1d]/70 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-white backdrop-blur md:left-8 md:top-8">
          {beforeLabel}
        </div>
      </div>

      <div
        className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_24px_rgba(0,0,0,0.35)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <span
          className={`absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full border border-white/50 bg-white text-[#1a1a1d] shadow-xl md:size-14 ${!hasInteracted ? 'before-after-hint' : ''}`}
        >
          <ChevronLeft className="size-4 md:size-5" />
          <ChevronRight className="size-4 md:size-5" />
        </span>
      </div>

      {!hasInteracted ? (
        <p className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#1a1a1d]/65 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/80 backdrop-blur">
          Arraste para comparar
        </p>
      ) : null}
    </div>
  )
}
