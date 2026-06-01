'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { testimonials } from '@/lib/data'
import { Star, Quote } from 'lucide-react'

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B8A5D]/[0.02] to-transparent" />

      <div className="relative z-10">
        <div className="text-center mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1B8A5D] text-sm tracking-widest uppercase mb-4 font-medium"
          >
            Patient Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1A12]"
          >
            What Our{" "}
            <span className="text-gradient-green">Patients Say</span>
          </motion.h2>
        </div>

        <div className="relative mask-fade-left">
          <div
            className="flex gap-6 px-8 overflow-x-auto no-scrollbar pb-8"
            ref={scrollRef}
            onWheel={(e) => {
              if (scrollRef.current) {
                scrollRef.current.scrollLeft += e.deltaY
              }
            }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % testimonials.length) * 0.05 }}
                className="flex-shrink-0 w-[420px]"
              >
                <div className="relative p-8 rounded-2xl bg-white border border-black/[0.06] h-full transition-all duration-500 hover:shadow-xl hover:shadow-[#1B8A5D]/5 hover:border-[#1B8A5D]/15 group shadow-sm">
                  <Quote className="w-8 h-8 text-[#1B8A5D]/20 mb-4" />

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#1B8A5D] text-[#1B8A5D]" />
                    ))}
                  </div>

                  <p className="text-[#4A5568] leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1B8A5D]/20"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#0F1A12]">{testimonial.name}</p>
                      <p className="text-xs text-[#4A5568]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
