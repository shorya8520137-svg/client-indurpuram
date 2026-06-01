import { NextResponse } from 'next/server'

export async function GET() {
  const { prisma } = await import('@/lib/prisma')

  try {
    const now = new Date()
    const in20Min = new Date(now.getTime() + 20 * 60 * 1000)
    const in30Min = new Date(now.getTime() + 30 * 60 * 1000)

    const appointments = await prisma.appointment.findMany({
      where: {
        smsSent: false,
        date: {
          gte: in20Min,
          lte: in30Min,
        },
      },
      include: { service: true, doctor: true },
    })

    let sentCount = 0

    for (const appointment of appointments) {
      const message = `Reminder: Hi ${appointment.patientName}, your ${appointment.service?.title ?? 'appointment'} with Dr. ${appointment.doctor?.name ?? 'our doctor'} is at ${appointment.time} on ${appointment.date.toLocaleDateString()}. Please arrive on time.`

      console.log(`[SMS Reminder] Sending to ${appointment.phone}: ${message}`)

      await prisma.smsLog.create({
        data: {
          to: appointment.phone,
          message,
          type: 'reminder',
          status: 'sent',
          referenceId: appointment.id,
        },
      })

      await prisma.appointment.update({
        where: { id: appointment.id },
        data: { smsSent: true },
      })

      sentCount++
    }

    return NextResponse.json({ sent: sentCount })
  } catch (error) {
    console.error('[SMS Reminders] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 },
    )
  }
}
