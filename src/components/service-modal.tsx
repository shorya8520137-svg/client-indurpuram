'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { X, Check, Clock } from 'lucide-react'
import type { Service } from '@/types'

export function ServiceModal({ service, children }: { service: Service; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl p-0 bg-white border border-black/[0.06] overflow-hidden">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center border border-black/[0.06] hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-[#0F1A12]" />
          </button>

          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[#0F1A12] mb-2">{service.title}</h3>
                <p className="text-[#4A5568] leading-relaxed text-sm">
                  {service.longDescription}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#0F1A12]">Benefits</h4>
                {service.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-sm text-[#4A5568]">
                    <div className="w-5 h-5 rounded-full bg-[#1B8A5D]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#1B8A5D]" />
                    </div>
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
                <div className="flex items-center gap-2 text-sm text-[#4A5568]">
                  <Clock className="w-4 h-4 text-[#1B8A5D]" />
                  {service.duration}
                </div>
                <span className="text-xl font-bold text-gradient-green">{service.price}</span>
              </div>

              <a
                href="#appointment"
                onClick={() => { setOpen(false); setTimeout(() => window.location.href = '#appointment', 100) }}
                className="block w-full py-3 rounded-xl text-center text-sm font-medium bg-gradient-to-r from-[#1B8A5D] to-[#2ECC71] text-white hover:shadow-lg hover:shadow-[#1B8A5D]/20 transition-all duration-300"
              >
                Book Appointment
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
