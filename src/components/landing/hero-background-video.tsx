'use client'

import { useEffect, useRef } from 'react'
import { figmaAssets } from '@/lib/figma-assets'

type HeroBackgroundVideoProps = {
  className?: string
}

export function HeroBackgroundVideo({ className }: HeroBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      const attempt = video.play()
      if (attempt !== undefined) {
        attempt.catch(() => {
          // iOS may block autoplay until a gesture; muted loop usually works on load.
        })
      }
    }

    play()

    if (video.readyState >= 2) return

    video.addEventListener('loadeddata', play, { once: true })
    return () => video.removeEventListener('loadeddata', play)
  }, [])

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={figmaAssets.heroPoster}
      aria-hidden
    >
      <source src={figmaAssets.heroVideo} type="video/mp4" />
    </video>
  )
}
