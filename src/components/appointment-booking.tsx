'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { services, doctors } from '@/lib/data'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { CalendarDays, Clock, User, Check, ChevronDown } from 'lucide-react'
import {
  Sparkles, Hammer, HeartPulse, Wand2, AlignCenter, Smile, Palette, Syringe,
} from 'lucide-react'

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

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

function BookingCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [booked, setBooked] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor || !selectedDate || !selectedTime || !name || !phone) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success(`${service.title} booked! Check WhatsApp for confirmation.`)
    setBooked(true)
    setSubmitting(false)
  }

  if (booked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-white border border-[#1B8A5D]/30 p-8 text-center shadow-sm"
      >
        <div className="w-14 h-14 rounded-full bg-[#1B8A5D]/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-[#1B8A5D]" />
        </div>
        <h4 className="text-lg font-semibold text-[#0F1A12] mb-1">Booking Confirmed!</h4>
        <p className="text-sm text-[#4A5568]">We'll send details on WhatsApp.</p>
        <button
          onClick={() => { setBooked(false); setSelectedDoctor(null); setSelectedDate(undefined); setSelectedTime(null); setName(''); setPhone('') }}
          className="mt-4 text-sm text-[#1B8A5D] hover:underline"
        >
          Book another
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden shadow-sm hover:shadow-md hover:border-[#1B8A5D]/20 transition-all duration-500"
    >
      <div className="relative h-40 overflow-hidden">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0F1A12]">{service.title}</h3>
            <p className="text-xs text-[#4A5568]">{service.duration}</p>
          </div>
          <span className="text-lg font-bold text-gradient-green">{service.price}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="text-xs text-[#4A5568] font-medium mb-1.5 block">
            <User className="w-3 h-3 inline mr-1 text-[#1B8A5D]" />Doctor
          </label>
          <select
            value={selectedDoctor || ''}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-black/[0.06] text-sm text-[#0F1A12] focus:outline-none focus:border-[#1B8A5D]/50 appearance-none"
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
            ))}
          </select>
        </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative" ref={calendarRef}>
              <label className="text-xs text-[#4A5568] font-medium mb-1.5 block">
                <CalendarDays className="w-3 h-3 inline mr-1 text-[#1B8A5D]" />Date
              </label>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-black/[0.06] text-sm text-left flex items-center justify-between focus:outline-none focus:border-[#1B8A5D]/50"
              >
                <span className={selectedDate ? 'text-[#0F1A12]' : 'text-[#94A3B3]'}>
                  {selectedDate ? selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#94A3B3] transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 z-50 bg-white border border-black/[0.06] rounded-xl shadow-lg"
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => { setSelectedDate(date); setShowCalendar(false) }}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          <div>
            <label className="text-xs text-[#4A5568] font-medium mb-1.5 block">
              <Clock className="w-3 h-3 inline mr-1 text-[#1B8A5D]" />Time
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  className={`p-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedTime === t
                      ? 'border-[#1B8A5D] bg-[#1B8A5D]/10 text-[#1B8A5D]'
                      : 'border-black/[0.06] text-[#4A5568] hover:border-[#1B8A5D]/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-black/[0.06] text-sm placeholder:text-[#94A3B3] focus:outline-none focus:border-[#1B8A5D]/50"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-black/[0.06] text-sm placeholder:text-[#94A3B3] focus:outline-none focus:border-[#1B8A5D]/50"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !selectedDoctor || !selectedDate || !selectedTime || !name || !phone}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1B8A5D] to-[#2ECC71] text-white text-sm font-medium disabled:opacity-40 hover:shadow-lg hover:shadow-[#1B8A5D]/20 transition-all"
        >
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </motion.div>
  )
}

export function AppointmentBooking() {
  return (
    <section id="appointment" className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B8A5D]/[0.02] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(27,138,93,0.03),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1B8A5D] text-sm tracking-widest uppercase mb-4 font-medium"
          >
            Book Your Visit
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1A12]"
          >
            Schedule Your{" "}
            <span className="text-gradient-green">Appointment</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <BookingCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
