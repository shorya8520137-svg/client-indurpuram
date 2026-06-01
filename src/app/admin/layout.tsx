'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageCircle, Calendar, FileText,
  Wrench, TrendingUp, Users, LogOut, Menu, X, Bell,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Chat Monitor', href: '/admin/chats', icon: MessageCircle },
  { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { label: 'Billing', href: '/admin/billing', icon: FileText },
  { label: 'Tickets', href: '/admin/tickets', icon: Wrench },
  { label: 'Revenue', href: '/admin/revenue', icon: TrendingUp },
  { label: 'Staff', href: '/admin/staff', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth !== 'true') {
      router.push('/admin/login')
    } else {
      setAuthed(true)
    }
  }, [router])

  if (pathname === '/admin/login') return <>{children}</>

  if (!authed) return null

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    document.cookie = 'admin_auth=; path=/; max-age=0'
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-4 flex flex-col lg:translate-x-0"
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B8A5D] flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <p className="text-sm font-bold">Wasi Dental</p>
              <p className="text-[10px] text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <button
                key={item.href}
                onClick={() => { router.push(item.href); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? 'bg-[#1B8A5D]/10 text-[#1B8A5D] font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all mt-auto"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </motion.aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-xl hover:bg-gray-100">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1B8A5D] flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
