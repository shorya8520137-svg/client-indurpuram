'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, Camera, Clock } from 'lucide-react'

interface Attendance {
  id: string
  date: string
  checkIn: string
  checkOut: string | null
  status: string
  verifiedBy: string
}

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  isActive: boolean
  attendance: Attendance[]
}

export default function AdminStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', department: '' })

  useEffect(() => { fetchStaff() }, [])

  async function fetchStaff() {
    try {
      const res = await fetch('/api/admin/staff')
      const data = await res.json()
      setStaff(data.staff || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowModal(false)
    setForm({ name: '', email: '', phone: '', role: '', department: '' })
    fetchStaff()
  }

  function handleTrainFace(staffMember: StaffMember) {
    alert(`Face training will be implemented for ${staffMember.name}`)
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
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your clinic team</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B8A5D] text-white text-sm font-medium hover:bg-[#1B8A5D]/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {selectedStaff ? (
        <div>
          <button
            onClick={() => setSelectedStaff(null)}
            className="flex items-center gap-2 text-sm text-[#1B8A5D] font-medium mb-4 hover:underline"
          >
            &larr; Back to Staff List
          </button>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#1B8A5D]/10 flex items-center justify-center">
                <span className="text-[#1B8A5D] font-bold text-lg">{selectedStaff.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">{selectedStaff.name}</h2>
                <p className="text-sm text-gray-400">{selectedStaff.role} &middot; {selectedStaff.department}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 pb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <h2 className="text-lg font-semibold">Attendance History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-gray-100">
                    <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Date</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Check In</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Check Out</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedStaff.attendance.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="px-6 py-3">{new Date(a.checkIn).toLocaleTimeString()}</td>
                      <td className="px-6 py-3">{a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '-'}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          a.status === 'present' ? 'bg-green-500/10 text-green-600' :
                          a.status === 'late' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500 capitalize">{a.verifiedBy}</td>
                    </tr>
                  ))}
                  {selectedStaff.attendance.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-300 text-sm">No attendance records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-gray-100">
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Name</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Email</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Phone</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Role</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Department</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staff.map((member) => (
                  <tr
                    key={member.id}
                    onClick={() => setSelectedStaff(member)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1B8A5D]/10 flex items-center justify-center">
                          <span className="text-[#1B8A5D] font-bold text-xs">{member.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{member.email}</td>
                    <td className="px-6 py-3 text-gray-500">{member.phone}</td>
                    <td className="px-6 py-3 text-gray-500">{member.role}</td>
                    <td className="px-6 py-3 text-gray-500">{member.department}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.isActive
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleTrainFace(member) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-xs text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Train Face
                      </button>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-300 text-sm">No staff members yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              <h2 className="text-lg font-bold mb-4">Add Staff Member</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Phone</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Role</label>
                  <input
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Department</label>
                  <input
                    required
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
                  />
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
                    Add Staff
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
