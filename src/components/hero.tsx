'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Star, Shield, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { heroSlides, siteContent } from '@/lib/data'

function MagneticButton({ className, href, children, ...props }: any) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / 8
    const dy = (e.clientY - cy) / 8
    x.set(dx)
    y.set(dy)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  )
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ left: string; top: string; opacity: number }>>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: 0.1 + Math.random() * 0.15,
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 2 === 0 ? '#1B8A5D' : '#2ECC71',
            left: p.left,
            top: p.top,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -20 - (i * 1.5), 0],
            opacity: [0.08, 0.2, 0.08],
          }}
          transition={{
            duration: 4 + (i * 0.3),
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function ImageSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0">
      {heroSlides.map((slide, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: i === current ? 1 : 0,
            scale: i === current ? 1 : 1.05,
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(27,138,93,0.06),transparent_60%)]" />
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <ImageSlider />
      <FloatingParticles />

      <motion.div style={{ y }} className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex flex-wrap items-center gap-3 px-4 py-2 rounded-full bg-white/80 border border-black/[0.06] shadow-sm"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#1B8A5D] text-[#1B8A5D]" />
                  ))}
                </div>
                <span className="text-[#4A5568] text-sm">
                  <span className="text-[#0F1A12] font-medium">4.9</span> Rating
                </span>
                <span className="w-1 h-1 rounded-full bg-black/[0.12]" />
                <span className="text-[#4A5568] text-sm">
                  <span className="text-[#0F1A12] font-medium">{siteContent.hero.patients}</span> Happy Patients
                </span>
                <span className="w-1 h-1 rounded-full bg-black/[0.12]" />
                <span className="text-[#4A5568] text-sm">
                  <span className="text-[#0F1A12] font-medium">{siteContent.hero.experience}</span> Experience
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9] text-[#0F1A12]"
              >
                <span className="block">Crafting</span>
                <span className="block text-gradient-green">Confident Smiles</span>
                <span className="block">Through Advanced</span>
                <span className="block text-gradient-mint">Dental Excellence</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg sm:text-xl text-[#4A5568] max-w-xl leading-relaxed"
              >
                {siteContent.hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <MagneticButton
                  href="#appointment"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#1B8A5D] to-[#2ECC71] text-white font-medium overflow-hidden shadow-lg shadow-[#1B8A5D]/25"
                >
                  <span className="relative z-10">Book Appointment</span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71] to-[#1B8A5D] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </MagneticButton>
                <a
                  href="#services"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border border-black/[0.08] text-[#4A5568] hover:text-[#0F1A12] font-medium transition-all duration-500 hover:scale-105 hover:shadow-md"
                >
                  Explore Treatments
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>

            <div className="hidden lg:block relative h-[600px]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute top-8 left-0 animate-float"
              >
                <div className="glass-strong rounded-2xl p-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B8A5D]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#1B8A5D]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F1A12]">Dental Implants</p>
                      <p className="text-xs text-[#4A5568]">Permanent tooth replacement</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute top-32 right-0 animate-float-delayed"
              >
                <div className="glass-strong rounded-2xl p-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#2ECC71]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F1A12]">Smile Makeover</p>
                      <p className="text-xs text-[#4A5568]">Complete transformation</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute top-56 left-10 animate-float"
                style={{ animationDelay: '2s' }}
              >
                <div className="glass-strong rounded-2xl p-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B8A5D]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#1B8A5D]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F1A12]">Root Canal</p>
                      <p className="text-xs text-[#4A5568]">Pain-free therapy</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute top-72 right-16 animate-float-delayed"
                style={{ animationDelay: '1s' }}
              >
                <div className="glass-strong rounded-2xl p-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#2ECC71]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F1A12]">Orthodontics</p>
                      <p className="text-xs text-[#4A5568]">Perfect alignment</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="absolute bottom-16 left-20 animate-float"
                style={{ animationDelay: '3s' }}
              >
                <div className="glass-strong rounded-2xl p-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B8A5D]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#1B8A5D]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F1A12]">Cosmetic</p>
                      <p className="text-xs text-[#4A5568]">Premium veneers</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#94A3B3] tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-black/[0.12] flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 rounded-full bg-gradient-to-b from-[#1B8A5D] to-[#2ECC71]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
