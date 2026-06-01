'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { galleryItems } from '@/lib/data'

function BeforeAfterSlider({ item, index }: { item: typeof galleryItems[0]; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pos = ((clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.max(0, Math.min(100, pos)))
  }, [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="group"
    >
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative rounded-2xl overflow-hidden cursor-ew-resize bg-white border border-black/[0.06] select-none shadow-sm"
      >
        <div className="aspect-[4/3] relative">
          <img
            src={item.afterImage}
            alt={`${item.title} - After`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={item.beforeImage}
              alt={`${item.title} - Before`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: `${100 / (sliderPos / 100)}%` }}
            />
          </div>

          <div
            className="absolute inset-y-0 flex items-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-0.5 h-full bg-white shadow-lg" />
            <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border border-black/[0.06]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L2 8L6 12" stroke="#1B8A5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 4L14 8L10 12" stroke="#1B8A5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur text-xs font-medium text-white/90">
            Before
          </div>
          <div
            className="absolute top-3 px-2.5 py-1 rounded-lg bg-[#1B8A5D]/80 backdrop-blur text-xs font-medium text-white"
            style={{ left: `${sliderPos}%`, marginLeft: 8 }}
          >
            After
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-base font-semibold text-[#0F1A12]">{item.title}</h3>
          <p className="text-sm text-[#4A5568] mt-1">{item.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function BeforeAfterSection() {
  const featured = galleryItems.slice(0, 4)

  return (
    <section id="before-after" className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B8A5D]/[0.02] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(27,138,93,0.04),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1B8A5D] text-sm tracking-widest uppercase mb-4 font-medium"
          >
            Real Transformations
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1A12]"
          >
            Before &{" "}
            <span className="text-gradient-green">After</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[#4A5568] max-w-2xl mx-auto"
          >
            Every smile tells a story. Slide to reveal the transformation.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((item, i) => (
            <BeforeAfterSlider key={item.id} item={item} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="#gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-black/[0.08] text-[#4A5568] hover:text-[#0F1A12] hover:shadow-sm transition-all"
          >
            View Full Gallery
          </a>
        </motion.div>
      </div>
    </section>
  )
}
