'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useUIStore } from '@/store/useStore'

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const { setIsLoading } = useUIStore()

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false)
      },
    })

    tl.to(progressRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power3.inOut',
    })
      .to(
        textRef.current,
        {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        containerRef.current,
        {
          clipPath: 'circle(0% at 50% 50%)',
          duration: 1.2,
          ease: 'power4.inOut',
        },
        '-=0.2'
      )

    return () => {
      tl.kill()
    }
  }, [setIsLoading])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-accent/30 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-accent/20 animate-pulse" />
          </div>
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-accent animate-spin" />
        </div>

        <div ref={textRef} className="text-center">
          <h2 className="text-2xl font-light tracking-[0.2em] text-foreground/80">
            WASI DENTAL
          </h2>
          <p className="text-sm text-foreground/40 mt-2 tracking-wider">
            Where Luxury Meets Precision
          </p>
        </div>

        <div className="w-48 h-[1px] bg-border relative overflow-hidden">
          <div
            ref={progressRef}
            className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-accent via-accent to-accent"
          />
        </div>
      </div>
    </div>
  )
}
