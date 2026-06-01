'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react'

interface Transaction {
  id: string
  type: string
  amount: number
  method: string
  date: string
  invoice: { invoiceNo: string } | null
}

interface RevenueData {
  totalRevenue: number
  pendingAmount: number
  thisMonth: number
  today: number
  monthlyRevenue: { month: string; amount: number }[]
  transactions: Transaction[]
}

const summaryCards = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
  { key: 'pendingAmount', label: 'Pending Amount', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
  { key: 'thisMonth', label: 'This Month', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
  { key: 'today', label: 'Today', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
]

export default function AdminRevenue() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => { fetchData() }, [])

  async function fetchData(dateFrom?: string, dateTo?: string) {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.set('from', dateFrom)
      if (dateTo) params.set('to', dateTo)
      const res = await fetch(`/api/admin/revenue?${params}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function handleFilter(e: React.FormEvent) {
    e.preventDefault()
    fetchData(from, to)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1B8A5D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const maxAmount = data?.monthlyRevenue.length
    ? Math.max(...data.monthlyRevenue.map((m) => m.amount), 1)
    : 1

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Revenue</h1>
          <p className="text-sm text-gray-400 mt-1">Track your clinic earnings</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => {
          const Icon = card.icon
          const value = data ? (data as any)[card.key] ?? 0 : 0
          return (
            <div key={card.key} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold">${value.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-1">{card.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Monthly Revenue</h2>
          </div>
          <div className="flex items-end gap-2 h-48">
            {data?.monthlyRevenue.map((item) => {
              const height = (item.amount / maxAmount) * 100
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400 font-medium">
                    ${item.amount >= 1000 ? `${(item.amount / 1000).toFixed(1)}k` : Math.round(item.amount)}
                  </span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[#1B8A5D] to-[#2ECC71] transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-gray-400 truncate w-full text-center">
                    {item.month.split(' ')[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Date Filter</h2>
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
          <form onSubmit={handleFilter} className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1B8A5D]/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#1B8A5D] text-white text-sm font-medium hover:bg-[#1B8A5D]/90 transition-colors"
            >
              Apply Filter
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100">
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Type</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Amount</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Method</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Date</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.type === 'payment' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-medium">${tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-3 text-gray-500 capitalize">{tx.method}</td>
                  <td className="px-6 py-3 text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-gray-500 font-mono text-xs">{tx.invoice?.invoiceNo || '-'}</td>
                </tr>
              ))}
              {(!data?.transactions || data.transactions.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-300 text-sm">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
