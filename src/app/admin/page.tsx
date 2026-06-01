'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Users, MessageCircle, TrendingUp, LogOut } from 'lucide-react'

const stats = [
  { label: 'Total Appointments', value: '156', icon: Calendar, change: '+12%', color: 'from-blue-500 to-cyan-500' },
  { label: 'Total Patients', value: '1,234', icon: Users, change: '+8%', color: 'from-purple-500 to-pink-500' },
  { label: 'Messages', value: '89', icon: MessageCircle, change: '+24%', color: 'from-green-500 to-emerald-500' },
  { label: 'Growth Rate', value: '94%', icon: TrendingUp, change: '+5%', color: 'from-orange-500 to-red-500' },
]

const recentAppointments = [
  { name: 'Sarah Johnson', service: 'Teeth Whitening', date: '2026-05-28', time: '10:00 AM', status: 'confirmed' },
  { name: 'Michael Chen', service: 'Dental Implants', date: '2026-05-28', time: '11:30 AM', status: 'pending' },
  { name: 'Emily Rodriguez', service: 'Smile Design', date: '2026-05-28', time: '2:00 PM', status: 'confirmed' },
  { name: 'James Wilson', service: 'Root Canal', date: '2026-05-29', time: '9:00 AM', status: 'pending' },
  { name: 'Aisha Patel', service: 'Kids Dentistry', date: '2026-05-29', time: '10:30 AM', status: 'cancelled' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth !== 'true') {
      router.push('/admin/login')
    } else {
      setAuthed(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }

  if (!authed) return null

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-foreground/50 mt-1">Manage your dental clinic</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-bold">A</span>
              </div>
              <button onClick={handleLogout} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-foreground/50 hover:text-accent hover:border-accent/30 transition-all" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl glass-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-foreground/50 mt-1">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div key={apt.name} className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div>
                      <p className="text-sm font-medium">{apt.name}</p>
                      <p className="text-xs text-foreground/50">{apt.service} - {apt.time}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                    apt.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {apt.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Appointment', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
                { label: 'Add Patient', icon: Users, color: 'from-purple-500 to-pink-500' },
                { label: 'View Messages', icon: MessageCircle, color: 'from-green-500 to-emerald-500' },
                { label: 'Analytics', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    className="p-4 rounded-xl glass-card hover:bg-accent/5 transition-all text-left group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
