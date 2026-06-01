'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Check, X, Eye } from 'lucide-react'

interface Appointment {
  id: string
  patientName: string
  email: string
  phone: string
  date: string
  time: string
  status: string
  notes?: string
  service: { title: string }
  doctor: { name: string }
}

const statusTabs = ['all', 'pending', 'confirmed', 'cancelled', 'completed']

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  confirmed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
  completed: 'bg-blue-500/10 text-blue-500',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    try {
      const res = await fetch('/api/admin/appointments')
      const data = await res.json()
      setAppointments(data)
    } catch {
      console.error('Failed to fetch appointments')
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      fetchAppointments()
    } catch {
      console.error('Failed to update appointment')
    }
  }

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-foreground/50 text-sm mt-1">Manage patient appointments</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              filter === tab
                ? 'bg-[#1B8A5D] text-white'
                : 'bg-white border border-gray-200 text-foreground/50 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent/10">
                <th className="text-left p-4 font-medium text-foreground/50">Patient</th>
                <th className="text-left p-4 font-medium text-foreground/50">Service</th>
                <th className="text-left p-4 font-medium text-foreground/50">Doctor</th>
                <th className="text-left p-4 font-medium text-foreground/50">Date</th>
                <th className="text-left p-4 font-medium text-foreground/50">Time</th>
                <th className="text-center p-4 font-medium text-foreground/50">Status</th>
                <th className="text-right p-4 font-medium text-foreground/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt, i) => (
                <motion.tr
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-accent/5 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{apt.patientName}</p>
                      <p className="text-xs text-foreground/50">{apt.email}</p>
                    </div>
                  </td>
                  <td className="p-4">{apt.service.title}</td>
                  <td className="p-4">{apt.doctor.name}</td>
                  <td className="p-4">{new Date(apt.date).toLocaleDateString()}</td>
                  <td className="p-4">{apt.time}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[apt.status] || 'bg-gray-500/10 text-gray-500'}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setExpanded(expanded === apt.id ? null : apt.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-foreground/30 hover:text-foreground/70 transition-all"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {apt.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'confirmed')}
                          className="p-2 rounded-lg hover:bg-green-50 text-green-500 transition-all"
                          title="Confirm"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'cancelled')}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-all"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'completed')}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-all"
                          title="Mark completed"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-foreground/30">
                    No {filter !== 'all' ? filter : ''} appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setExpanded(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg p-6"
            >
              {(() => {
                const apt = appointments.find((a) => a.id === expanded)
                if (!apt) return null
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Appointment Details</h2>
                      <button onClick={() => setExpanded(null)} className="p-2 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-foreground/50">Patient Name</p>
                          <p className="font-medium">{apt.patientName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize mt-1 ${statusColors[apt.status]}`}>
                            {apt.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Email</p>
                          <p className="font-medium">{apt.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Phone</p>
                          <p className="font-medium">{apt.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Service</p>
                          <p className="font-medium">{apt.service.title}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Doctor</p>
                          <p className="font-medium">{apt.doctor.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Date</p>
                          <p className="font-medium">{new Date(apt.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">Time</p>
                          <p className="font-medium">{apt.time}</p>
                        </div>
                      </div>
                      {apt.notes && (
                        <div>
                          <p className="text-xs text-foreground/50">Notes</p>
                          <p className="text-sm mt-1">{apt.notes}</p>
                        </div>
                      )}
                    </div>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
