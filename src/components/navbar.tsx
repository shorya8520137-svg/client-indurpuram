'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B8A5D] to-[#2ECC71] flex items-center justify-center shadow-lg shadow-[#1B8A5D]/20">
              <span className="text-white text-base font-bold">W</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#0F1A12]">
              Wasi <span className="text-[#1B8A5D]">Dental</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm text-[#4A5568] hover:text-[#0F1A12] hover:bg-black/[0.03] transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/admin"
              className="px-4 py-2 rounded-full text-sm text-[#4A5568] hover:text-[#1B8A5D] hover:bg-black/[0.03] transition-all duration-300"
            >
              Admin
            </a>
            <a
              href="#appointment"
              className="ml-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#1B8A5D] to-[#2ECC71] text-white text-sm font-medium shadow-lg shadow-[#1B8A5D]/20 hover:shadow-xl hover:shadow-[#1B8A5D]/30 hover:scale-105 transition-all duration-500"
            >
              Book Appointment
            </a>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-black/[0.04] flex items-center justify-center text-[#0F1A12]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-2xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-[#4A5568] hover:text-[#0F1A12] hover:bg-black/[0.02] transition-all"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-[#4A5568] hover:text-[#0F1A12] hover:bg-black/[0.02] transition-all"
              >
                Admin
              </a>
              <a
                href="#appointment"
                onClick={() => setMobileOpen(false)}
                className="block mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1B8A5D] to-[#2ECC71] text-white text-center font-medium"
              >
                Book Appointment
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
