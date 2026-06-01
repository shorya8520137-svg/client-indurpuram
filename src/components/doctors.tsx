'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { doctors } from '@/lib/data'
import { Award, GraduationCap, Calendar } from 'lucide-react'

export function DoctorsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  return (
    <section id="doctors" ref={ref} className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B8A5D]/[0.02] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(27,138,93,0.03),transparent_50%)]" />

      <div className="relative z-10">
        <div className="text-center mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1B8A5D] text-sm tracking-widest uppercase mb-4 font-medium"
          >
            Expert Team
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1A12]"
          >
            Meet Our{" "}
            <span className="text-gradient-green">Specialists</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[#4A5568] max-w-2xl mx-auto"
          >
            World-class dental professionals dedicated to your perfect smile
          </motion.p>
        </div>

        <motion.div style={{ x }} className="flex gap-6 px-8 pb-8 overflow-x-auto no-scrollbar">
          {doctors.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function DoctorCard({ doctor, index }: { doctor: typeof doctors[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 w-[380px] group"
    >
      <div className="relative rounded-3xl bg-white border border-black/[0.06] overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#1B8A5D]/5 hover:border-[#1B8A5D]/20">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1B8A5D]/[0.03]" />

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-[#0F1A12] mb-1">{doctor.name}</h3>
            <p className="text-sm text-[#1B8A5D] mb-1">{doctor.title}</p>
            <p className="text-xs text-[#4A5568]">{doctor.specialization}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-[#4A5568]">
              <Calendar className="w-3.5 h-3.5 text-[#1B8A5D]" />
              <span>{doctor.experience}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#4A5568]">
              <GraduationCap className="w-3.5 h-3.5 text-[#1B8A5D]" />
              <span className="truncate">{doctor.education}</span>
            </div>
          </div>

          <p className="text-sm text-[#4A5568] leading-relaxed">
            {doctor.bio}
          </p>

          <div className="flex flex-wrap gap-2">
            {doctor.certifications.slice(0, 3).map((cert) => (
              <span key={cert} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1B8A5D]/5 border border-[#1B8A5D]/10 text-xs text-[#1B8A5D]/80">
                <Award className="w-3 h-3" />
                {cert}
              </span>
            ))}
          </div>

          <a
            href="#appointment"
            className="block w-full py-3 rounded-xl text-center text-sm font-medium bg-gradient-to-r from-[#1B8A5D] to-[#2ECC71] text-white hover:shadow-lg hover:shadow-[#1B8A5D]/20 transition-all duration-300"
          >
            Book with {doctor.name.split(' ')[0]}
          </a>
        </div>
      </div>
    </motion.div>
  )
}
