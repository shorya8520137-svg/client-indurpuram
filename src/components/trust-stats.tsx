'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function CountUp({ end, suffix = '', isPercent = false, isStar = false }: { end: string; suffix?: string; isPercent?: boolean; isStar?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  const num = parseInt(end.replace(/[^0-9]/g, ''))

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className="text-5xl sm:text-6xl font-bold tracking-tight text-gradient-green"
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          {num.toLocaleString()}{suffix}
        </motion.span>
      )}
    </motion.span>
  )
}

const stats = [
  { value: '5000', label: 'Treatments', suffix: '+' },
  { value: '98', label: 'Success Rate', suffix: '%' },
  { value: '20', label: 'Years Experience', suffix: '+' },
  { value: '4.9', label: 'Patient Rating', suffix: '★' },
]

export function TrustStats() {
  return (
    <section className="relative py-20 border-y border-black/[0.06] bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B8A5D]/[0.02] via-transparent to-[#2ECC71]/[0.02]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center group"
            >
              <div className="text-5xl sm:text-6xl font-bold tracking-tight text-gradient-green">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-[#4A5568] group-hover:text-[#0F1A12] transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
