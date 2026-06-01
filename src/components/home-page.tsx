'use client'

import { Hero } from './hero'
import { TrustStats } from './trust-stats'
import { BeforeAfterSection } from './before-after'
import { ServicesSection } from './services'
import { DoctorsSection } from './doctors'
import { TestimonialsSection } from './testimonials'
import { GallerySection } from './gallery'
import { AppointmentBooking } from './appointment-booking'
import { ContactSection } from './contact'

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <BeforeAfterSection />
      <ServicesSection />
      <DoctorsSection />
      <TestimonialsSection />
      <GallerySection />
      <AppointmentBooking />
      <ContactSection />
    </>
  )
}
