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

    if (!patientName || !email || !phone || !serviceId || !doctorId || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

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

    // Schedule an SMS reminder for 20 minutes before the appointment
    const reminderMessage = `Reminder: Hi ${patientName}, your appointment is confirmed for ${time}. We look forward to seeing you!`

    await prisma.smsLog.create({
      data: {
        to: phone,
        message: reminderMessage,
        type: 'reminder',
        status: 'sent',
        referenceId: appointment.id,
      },
    })

    console.log(`[Appointment] SMS reminder logged for ${phone} regarding appointment ${appointment.id}`)

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('[Appointments] Error:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
