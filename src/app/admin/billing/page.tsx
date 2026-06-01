'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Plus, X, Trash2 } from 'lucide-react'

interface InvoiceItem {
  service: string
  quantity: number
  rate: number
}

interface Invoice {
  id: string
  invoiceNo: string
  patientName: string
  total: number
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  paid: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    tax: 0,
    discount: 0,
  })
  const [items, setItems] = useState<InvoiceItem[]>([{ service: '', quantity: 1, rate: 0 }])

  useEffect(() => {
    fetchInvoices()
  }, [])

  async function fetchInvoices() {
    try {
      const res = await fetch('/api/admin/invoices')
      const data = await res.json()
      setInvoices(data)
    } catch {
      console.error('Failed to fetch invoices')
    }
  }

  function addItem() {
    setItems([...items, { service: '', quantity: 1, rate: 0 }])
  }

  function removeItem(index: number) {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: keyof InvoiceItem, value: string | number) {
    const updated = [...items]
    ;(updated[index] as any)[field] = value
    setItems(updated)
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const taxAmount = subtotal * (form.tax / 100)
  const total = subtotal + taxAmount - form.discount

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items }),
      })
      setShowModal(false)
      setForm({ patientName: '', patientEmail: '', patientPhone: '', tax: 0, discount: 0 })
      setItems([{ service: '', quantity: 1, rate: 0 }])
      fetchInvoices()
    } catch {
      console.error('Failed to create invoice')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-foreground/50 text-sm mt-1">Manage invoices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B8A5D] text-white text-sm font-medium hover:bg-[#1B8A5D]/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent/10">
                <th className="text-left p-4 font-medium text-foreground/50">Invoice</th>
                <th className="text-left p-4 font-medium text-foreground/50">Patient</th>
                <th className="text-right p-4 font-medium text-foreground/50">Total</th>
                <th className="text-center p-4 font-medium text-foreground/50">Status</th>
                <th className="text-right p-4 font-medium text-foreground/50">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-accent/5 hover:bg-accent/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-foreground/30" />
                      <span className="font-medium">{inv.invoiceNo}</span>
                    </div>
                  </td>
                  <td className="p-4">{inv.patientName}</td>
                  <td className="p-4 text-right font-medium">${inv.total.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[inv.status] || 'bg-gray-500/10 text-gray-500'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-foreground/50">{new Date(inv.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/30">No invoices yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">New Invoice</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground/50 mb-1 block">Patient Name</label>
                    <input
                      required
                      value={form.patientName}
                      onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B8A5D]/20 focus:border-[#1B8A5D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground/50 mb-1 block">Email</label>
                    <input
                      required
                      type="email"
                      value={form.patientEmail}
                      onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B8A5D]/20 focus:border-[#1B8A5D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground/50 mb-1 block">Phone</label>
                    <input
                      required
                      value={form.patientPhone}
                      onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B8A5D]/20 focus:border-[#1B8A5D]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-foreground/50">Invoice Items</label>
                    <button type="button" onClick={addItem} className="text-xs text-[#1B8A5D] font-medium hover:underline">
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <input
                          required
                          placeholder="Service name"
                          value={item.serviceName}
                          onChange={(e) => updateItem(i, 'service', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B8A5D]/20 focus:border-[#1B8A5D]"
                        />
                        <input
                          required
                          type="number"
                          min={1}
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B8A5D]/20 focus:border-[#1B8A5D]"
                        />
                        <input
                          required
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => updateItem(i, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B8A5D]/20 focus:border-[#1B8A5D]"
                        />
                        <span className="text-sm text-foreground/50 py-2 w-20 text-right whitespace-nowrap">
                          ${(item.quantity * item.rate).toFixed(2)}
                        </span>
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(i)} className="p-2 text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground/50 mb-1 block">Tax (%)</label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={form.tax}
                      onChange={(e) => setForm({ ...form, tax: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B8A5D]/20 focus:border-[#1B8A5D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground/50 mb-1 block">Discount ($)</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.discount}
                      onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B8A5D]/20 focus:border-[#1B8A5D]"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Tax ({form.tax}%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  {form.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Discount</span>
                      <span className="text-red-500">-${form.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#1B8A5D] text-white font-medium hover:bg-[#1B8A5D]/90 transition-all"
                >
                  Create Invoice
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
