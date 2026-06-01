import { NextResponse } from 'next/server'

let prismaClient: any = null

async function getPrisma() {
  if (!prismaClient) {
    try {
      const { prisma } = await import('@/lib/prisma')
      prismaClient = prisma
    } catch {
      return null
    }
  }
  return prismaClient
}

export async function GET() {
  const prisma = await getPrisma()
  if (!prisma) {
    return NextResponse.json({
      totalAppointments: 0,
      todayAppointments: 0,
      totalPatients: 0,
      activeChats: 0,
      todayRevenue: 0,
      recentAppointments: [],
    })
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [
      totalAppointments,
      todayAppointments,
      totalPatients,
      activeChats,
      todayRevenueResult,
      recentAppointments,
    ] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          date: { gte: today, lt: tomorrow },
        },
      }),
      prisma.patient.count(),
      prisma.chatSession.count({
        where: { status: 'active' },
      }),
      prisma.invoice.aggregate({
        _sum: { total: true },
        where: {
          status: 'paid',
          createdAt: { gte: today, lt: tomorrow },
        },
      }),
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { service: true, doctor: true },
      }),
    ])

    return NextResponse.json({
      totalAppointments,
      todayAppointments,
      totalPatients,
      activeChats,
      todayRevenue: todayRevenueResult._sum.total ?? 0,
      recentAppointments,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
