'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { siteContent } from '@/lib/data'
import { Globe, Camera, MessageCircle, Play, CircleUser, ArrowUp } from 'lucide-react'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-black/[0.06] bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B8A5D]/[0.02] to-[#1B8A5D]/[0.03]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B8A5D] to-[#2ECC71] flex items-center justify-center shadow-lg shadow-[#1B8A5D]/20">
                <span className="text-white text-lg font-bold">W</span>
              </div>
              <span className="text-lg font-semibold tracking-wider text-[#0F1A12]">Wasi Dental</span>
            </div>
            <p className="text-sm text-[#4A5568] max-w-md leading-relaxed">
              {siteContent.about.content}
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Globe className="w-4 h-4" />, href: siteContent.social.facebook },
                { icon: <Camera className="w-4 h-4" />, href: siteContent.social.instagram },
                { icon: <MessageCircle className="w-4 h-4" />, href: siteContent.social.twitter },
                { icon: <Play className="w-4 h-4" />, href: siteContent.social.youtube },
                { icon: <CircleUser className="w-4 h-4" />, href: siteContent.social.linkedin },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#4A5568] hover:text-[#1B8A5D] hover:border-[#1B8A5D]/30 transition-all duration-300 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 tracking-wider uppercase text-[#4A5568]">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Services', 'Doctors', 'Smile Gallery', 'Reviews', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-[#4A5568] hover:text-[#1B8A5D] transition-colors duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 tracking-wider uppercase text-[#4A5568]">Contact</h3>
            <ul className="space-y-3 text-sm text-[#4A5568]">
              <li>{siteContent.contact.address}</li>
              <li>
                <a href={`tel:${siteContent.contact.phone}`} className="hover:text-[#1B8A5D] transition-colors">
                  {siteContent.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteContent.contact.email}`} className="hover:text-[#1B8A5D] transition-colors">
                  {siteContent.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94A3B3]">
            &copy; {new Date().getFullYear()} Wasi Dental Clinic. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-[#94A3B3] hover:text-[#4A5568] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-[#94A3B3] hover:text-[#4A5568] transition-colors">
              Terms of Service
            </Link>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#4A5568] hover:text-[#1B8A5D] hover:border-[#1B8A5D]/30 transition-all duration-300 shadow-sm"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
