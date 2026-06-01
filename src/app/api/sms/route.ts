import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { prisma } = await import('@/lib/prisma')

  try {
    const body = await request.json()
    const { to, message, type = 'reminder', referenceId } = body

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 },
      )
    }

    // Mock SMS service — logs to console; swap with Twilio/bulk provider later
    console.log(`[SMS] Sending ${type} to ${to}: ${message}`)

    const log = await prisma.smsLog.create({
      data: {
        to,
        message,
        type,
        status: 'sent',
        referenceId,
      },
    })

    return NextResponse.json({ success: true, id: log.id }, { status: 201 })
  } catch (error) {
    console.error('[SMS] Error:', error)
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
  }
}
