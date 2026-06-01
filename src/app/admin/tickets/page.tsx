'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wrench, Plus, ArrowRight } from 'lucide-react'

interface Ticket {
  id: string
  title: string
  description: string
  equipment: string
  priority: string
  status: string
  reportedBy: string
  assignedTo: string | null
  notes: string | null
  createdAt: string
}

const columns = ['open', 'in_progress', 'resolved']
const columnLabels: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}
const columnColors: Record<string, string> = {
  open: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  in_progress: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  resolved: 'bg-green-500/10 text-green-600 border-green-500/20',
}
const priorityColors: Record<string, string> = {
  high: 'bg-red-500/10 text-red-600 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-600 border-green-500/20',
}

function TicketCard({ ticket, onStatusChange }: { ticket: Ticket; onStatusChange: (id: string, status: string) => void }) {
  const nextStatus: Record<string, string> = {
    open: 'in_progress',
    in_progress: 'resolved',
    resolved: 'open',
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold leading-snug flex-1">{ticket.title}</h4>
        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium border ${priorityColors[ticket.priority] || priorityColors.medium}`}>
          {ticket.priority}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-2">{ticket.equipment}</p>
      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <span>{ticket.reportedBy}</span>
        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
      <button
        onClick={() => onStatusChange(ticket.id, nextStatus[ticket.status])}
        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
      >
        Move to {columnLabels[nextStatus[ticket.status]]}
        <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  )
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', equipment: '', priority: 'medium', reportedBy: '' })

  useEffect(() => { fetchTickets() }, [])

  async function fetchTickets() {
    try {
      const res = await fetch('/api/admin/tickets')
      const data = await res.json()
      setTickets(data.tickets || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch('/api/admin/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchTickets()
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/admin/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, reportedBy: form.reportedBy || 'Admin' }),
    })
    setShowModal(false)
    setForm({ title: '', description: '', equipment: '', priority: 'medium', reportedBy: '' })
    fetchTickets()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1B8A5D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Tickets</h1>
          <p className="text-sm text-gray-400 mt-1">Manage equipment and facility requests</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B8A5D] text-white text-sm font-medium hover:bg-[#1B8A5D]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colTickets = tickets.filter((t) => t.status === col)
          return (
            <div key={col} className={`rounded-2xl p-4 border ${columnColors[col]}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  <h3 className="text-sm font-semibold">{columnLabels[col]}</h3>
                </div>
                <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded-full">
                  {colTickets.length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                  {colTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} onStatusChange={handleStatusChange} />
                  ))}
                </AnimatePresence>
                {colTickets.length === 0 && (
                  <p className="text-xs text-center text-gray-300 py-8">No tickets</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h2 className="text-lg font-bold mb-4">New Maintenance Ticket</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Title</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Description</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Equipment</label>
                  <input
                    required
                    value={form.equipment}
                    onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#1B8A5D] text-white text-sm font-medium hover:bg-[#1B8A5D]/90 transition-colors"
                  >
                    Create Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
