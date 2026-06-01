'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteContent, faqItems } from '@/lib/data'
import { MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function ContactSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(27,138,93,0.03),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1B8A5D] text-sm tracking-widest uppercase mb-4 font-medium"
          >
            Get In Touch
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1A12]"
          >
            We&apos;d Love To{" "}
            <span className="text-gradient-green">Hear From You</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-white border border-black/[0.06] p-6 space-y-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B8A5D]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#1B8A5D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F1A12] mb-1">Our Location</p>
                  <p className="text-sm text-[#4A5568]">{siteContent.contact.address}</p>
                </div>
              </div>

              <div className="w-full h-px bg-black/[0.06]" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B8A5D]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#1B8A5D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F1A12] mb-1">Phone</p>
                  <p className="text-sm text-[#4A5568]">{siteContent.contact.phone}</p>
                  <p className="text-sm text-[#1B8A5D]/80 mt-1">Emergency: {siteContent.contact.emergency}</p>
                </div>
              </div>

              <div className="w-full h-px bg-black/[0.06]" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B8A5D]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#1B8A5D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F1A12] mb-1">Email</p>
                  <p className="text-sm text-[#4A5568]">{siteContent.contact.email}</p>
                </div>
              </div>

              <div className="w-full h-px bg-black/[0.06]" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B8A5D]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#1B8A5D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F1A12] mb-1">Opening Hours</p>
                  {Object.entries(siteContent.contact.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm text-[#4A5568] py-0.5">
                      <span>{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-white border border-black/[0.06] h-[250px] shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.110641304039!2d72.8225!3d18.925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c73a0d8b0b%3A0x6c6b6b6b6b6b6b6b!2sMarine%20Drive%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-white border border-black/[0.06] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F1A12] mb-6">Send Us a Message</h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-[#4A5568]">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.06] text-sm placeholder:text-[#94A3B3] focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#4A5568]">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.06] text-sm placeholder:text-[#94A3B3] focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-[#4A5568]">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.06] text-sm placeholder:text-[#94A3B3] focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-[#4A5568]">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.06] text-sm placeholder:text-[#94A3B3] focus:outline-none focus:border-[#1B8A5D]/50 transition-colors resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1B8A5D] to-[#2ECC71] text-white font-medium hover:shadow-lg hover:shadow-[#1B8A5D]/20 transition-all"
                >
                  Send Message
                </motion.button>
              </form>
            </div>

            <div className="rounded-2xl bg-white border border-black/[0.06] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F1A12] mb-6">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqItems.map((faq, index) => (
                  <div key={index} className="border border-black/[0.06] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-sm font-medium text-[#0F1A12] hover:bg-[#1B8A5D]/5 transition-colors"
                    >
                      {faq.q}
                      <ChevronDown
                        className={`w-4 h-4 text-[#4A5568] transition-transform duration-300 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: openFaq === index ? 'auto' : 0,
                        opacity: openFaq === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-[#4A5568] leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
