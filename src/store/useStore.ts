'use client'

import { create } from 'zustand'

interface UIState {
  isMenuOpen: boolean
  isChatOpen: boolean
  isBookingOpen: boolean
  isLoading: boolean
  isEmergencyPopup: boolean
  theme: 'light' | 'dark'
  setIsMenuOpen: (open: boolean) => void
  setIsChatOpen: (open: boolean) => void
  setIsBookingOpen: (open: boolean) => void
  setIsLoading: (loading: boolean) => void
  setIsEmergencyPopup: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isChatOpen: false,
  isBookingOpen: false,
  isLoading: true,
  isEmergencyPopup: false,
  theme: 'dark',
  setIsMenuOpen: (open) => set({ isMenuOpen: open }),
  setIsChatOpen: (open) => set({ isChatOpen: open }),
  setIsBookingOpen: (open) => set({ isBookingOpen: open }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsEmergencyPopup: (open) => set({ isEmergencyPopup: open }),
  setTheme: (theme) => set({ theme }),
}))

interface AppointmentState {
  selectedService: string | null
  selectedDoctor: string | null
  selectedDate: string | null
  selectedTime: string | null
  step: number
  setSelectedService: (service: string | null) => void
  setSelectedDoctor: (doctor: string | null) => void
  setSelectedDate: (date: string | null) => void
  setSelectedTime: (time: string | null) => void
  setStep: (step: number) => void
  reset: () => void
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  selectedService: null,
  selectedDoctor: null,
  selectedDate: null,
  selectedTime: null,
  step: 0,
  setSelectedService: (service) => set({ selectedService: service, step: 1 }),
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor, step: 2 }),
  setSelectedDate: (date) => set({ selectedDate: date, step: 3 }),
  setSelectedTime: (time) => set({ selectedTime: time, step: 4 }),
  setStep: (step) => set({ step }),
  reset: () => set({
    selectedService: null,
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,
    step: 0,
  }),
}))
