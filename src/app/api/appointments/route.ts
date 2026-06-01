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

export async function POST(request: Request) {
  const prisma = await getPrisma()
  if (!prisma) {
    return NextResponse.json({ success: true })
  }
  try {
    const body = await request.json()
    const { patientName, email, phone, serviceId, doctorId, date, time, notes } = body

    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        email,
        phone,
        serviceId,
        doctorId,
        date: new Date(date),
        time,
        notes,
      },
      include: { service: true, doctor: true },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
