'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { services } from '@/lib/data'
import { ServiceModal } from './service-modal'
import {
  Sparkles, Hammer, HeartPulse, Wand2, AlignCenter, Smile, Palette, Syringe,
} from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  Hammer: <Hammer className="w-5 h-5" />,
  Wand2: <Wand2 className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  AlignCenter: <AlignCenter className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Syringe: <Syringe className="w-5 h-5" />,
}

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['15%', '-15%'])

  return (
    <section id="services" ref={ref} className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(27,138,93,0.03),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(46,204,113,0.03),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1B8A5D] text-sm tracking-widest uppercase mb-4 font-medium"
          >
            Our Treatments
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1A12]"
          >
            Premium Dental{" "}
            <span className="text-gradient-green">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[#4A5568] max-w-2xl mx-auto"
          >
            Comprehensive care using the latest technology and premium materials
          </motion.p>
        </div>

        <motion.div style={{ y }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} icon={iconMap[service.icon]} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ServiceCard({ service, index, icon }: { service: typeof services[0]; index: number; icon: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <ServiceModal service={service}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative p-6 rounded-2xl bg-white border border-black/[0.06] cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-[#1B8A5D]/5 hover:border-[#1B8A5D]/20 hover:bg-white"
          style={{ transition: 'transform 0.2s ease' }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1B8A5D]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl bg-[#1B8A5D]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500">
              <span className="text-[#1B8A5D]">{icon}</span>
            </div>

            <h3 className="text-base font-semibold text-[#0F1A12] mb-2 group-hover:text-[#1B8A5D] transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-sm text-[#4A5568] leading-relaxed mb-4 line-clamp-2">
              {service.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
              <span className="text-xs text-[#94A3B3]">{service.duration}</span>
              <span className="text-sm font-semibold text-gradient-green">{service.price}</span>
            </div>
          </div>
        </div>
      </ServiceModal>
    </motion.div>
  )
}
