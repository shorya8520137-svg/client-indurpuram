import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const dateFilter: any = {}
    if (from || to) {
      dateFilter.createdAt = {}
      if (from) dateFilter.createdAt.gte = new Date(from)
      if (to) dateFilter.createdAt.lte = new Date(to)
    }

    const paidInvoices = await prisma.invoice.findMany({
      where: { status: 'paid', ...dateFilter },
    })
    const pendingInvoices = await prisma.invoice.findMany({
      where: { status: 'pending', ...dateFilter },
    })

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0)

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const thisMonthInvoices = paidInvoices.filter(
      (inv) => new Date(inv.createdAt) >= startOfMonth
    )
    const thisMonth = thisMonthInvoices.reduce((sum, inv) => sum + inv.total, 0)

    const todayInvoices = paidInvoices.filter(
      (inv) => new Date(inv.createdAt) >= startOfToday
    )
    const today = todayInvoices.reduce((sum, inv) => sum + inv.total, 0)

    const monthlyMap: Record<string, number> = {}
    for (const inv of paidInvoices) {
      const key = new Date(inv.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      })
      monthlyMap[key] = (monthlyMap[key] || 0) + inv.total
    }
    const monthlyRevenue = Object.entries(monthlyMap).map(([month, amount]) => ({
      month,
      amount,
    }))

    const transactions = await prisma.transaction.findMany({
      take: 50,
      orderBy: { date: 'desc' },
      include: { invoice: { select: { invoiceNo: true } } },
    })

    return NextResponse.json({
      totalRevenue,
      pendingAmount,
      thisMonth,
      today,
      monthlyRevenue,
      transactions,
    })
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 })
  }
}
