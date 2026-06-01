'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { galleryItems } from '@/lib/data'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const next = useCallback(() => {
    setSelectedIndex((prev) => prev !== null ? (prev + 1) % galleryItems.length : 0)
  }, [])

  const prev = useCallback(() => {
    setSelectedIndex((prev) => prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : 0)
  }, [])

  return (
    <section id="gallery" className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(46,204,113,0.03),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1B8A5D] text-sm tracking-widest uppercase mb-4 font-medium"
          >
            Smile Gallery
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1A12]"
          >
            Transformations{" "}
            <span className="text-gradient-green">That Speak</span>
          </motion.h2>
        </div>

        <div className="columns-1 md:columns-2 gap-5 space-y-5">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-white border border-black/[0.06] transition-all duration-500 hover:shadow-xl hover:shadow-[#1B8A5D]/5 hover:border-[#1B8A5D]/20">
                <div className="grid grid-cols-2">
                  <div className="relative aspect-square">
                    <img
                      src={item.beforeImage}
                      alt={`${item.title} - Before`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/50 backdrop-blur text-xs font-medium text-white/90">
                      Before
                    </div>
                  </div>
                  <div className="relative aspect-square">
                    <img
                      src={item.afterImage}
                      alt={`${item.title} - After`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-[#1B8A5D]/70 backdrop-blur text-xs font-medium text-white">
                      After
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="font-semibold text-[#0F1A12]">{item.title}</h3>
                  <p className="text-sm text-[#4A5568]">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="sm:max-w-[90vw] p-0 bg-white/95 backdrop-blur-2xl border-black/[0.06]">
          {selectedIndex !== null && (
            <div className="relative">
              <div className="grid grid-cols-2">
                <div className="relative aspect-video">
                  <img
                    src={galleryItems[selectedIndex].beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur text-sm font-medium text-white/90">
                    Before
                  </div>
                </div>
                <div className="relative aspect-video">
                  <img
                    src={galleryItems[selectedIndex].afterImage}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[#1B8A5D]/70 backdrop-blur text-sm font-medium text-white">
                    After
                  </div>
                </div>
              </div>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-black/[0.06] flex items-center justify-center hover:bg-[#1B8A5D]/10 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-[#0F1A12]" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-black/[0.06] flex items-center justify-center hover:bg-[#1B8A5D]/10 transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-[#0F1A12]" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
