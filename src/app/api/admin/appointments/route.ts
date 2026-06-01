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
    return NextResponse.json([])
  }
  try {
    const appointments = await prisma.appointment.findMany({
      include: { service: true, doctor: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(appointments)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const prisma = await getPrisma()
  if (!prisma) {
    return NextResponse.json({ success: true })
  }
  try {
    const body = await request.json()
    const { id, status } = body

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: { service: true, doctor: true },
    })

    return NextResponse.json(appointment)
  } catch {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}
