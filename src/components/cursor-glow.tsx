'use client'

import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-[300px] h-[300px] pointer-events-none z-[9999] mix-blend-screen"
      style={{
        background: 'radial-gradient(circle, oklch(0.52 0.2 155 / 0.12) 0%, transparent 70%)',
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
    />
  )
}
