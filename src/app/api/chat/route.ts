const SYSTEM_PROMPT = `You are a helpful dental clinic assistant for Wasi Dental Clinic, a luxury dental clinic in Mumbai. 
Answer questions about:
- Services: dental implants, smile design, teeth whitening, root canals, veneers, Invisalign, laser dentistry, etc.
- Bookings and appointments
- Clinic location: Marine Drive, Mumbai
- Contact information

Be friendly, professional, and concise. If asked about booking, guide them to book an appointment.`

export function GET() {
  return Response.json({ status: 'Chat API ready' })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, sessionId, patientName, patientEmail, patientPhone } = body

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://client-indurpuram.vercel.app',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-24b-instruct-2501',
        temperature: 0,
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content },
        ],
      }),
    })

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || 'Thank you! Our team will get back to you shortly.'

    const bookingMatch = content.match(/book|appointment|schedule|visit/i)

    const { prisma } = await import('@/lib/prisma')

    let activeSessionId = sessionId

    if (activeSessionId) {
      let session = await prisma.chatSession.findUnique({ where: { id: activeSessionId } })
      if (!session) {
        session = await prisma.chatSession.create({
          data: {
            id: activeSessionId,
            patientName: patientName || null,
            patientEmail: patientEmail || null,
            patientPhone: patientPhone || null,
            status: 'active',
          },
        })
      }

      await prisma.chatMessage.create({
        data: {
          content,
          sender: patientName || 'Anonymous',
          isAdmin: false,
          sessionId: activeSessionId,
        },
      })

      await prisma.chatMessage.create({
        data: {
          content: reply,
          sender: 'Bot',
          isAdmin: false,
          sessionId: activeSessionId,
        },
      })
    }

    if (bookingMatch && patientName && patientPhone) {
      const appointmentData: any = {
        patientName,
        email: patientEmail || '',
        phone: patientPhone,
        notes: content,
        date: new Date(),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        status: 'pending',
        serviceId: (await prisma.service.findFirst({ where: { isActive: true } }))?.id || '',
        doctorId: (await prisma.doctor.findFirst())?.id || '',
      }

      if (appointmentData.serviceId && appointmentData.doctorId) {
        await prisma.appointment.create({ data: appointmentData })
      }
    }

    return Response.json({
      success: true,
      reply,
      message: { content: reply },
      intent: bookingMatch ? 'booking' : 'general',
      sessionId: activeSessionId,
    }, { status: 201 })
  } catch {
    return Response.json({
      success: true,
      reply: 'Thank you! Our team will get back to you shortly.',
      message: { content: 'Thank you! Our team will get back to you shortly.' },
      intent: 'general',
    }, { status: 201 })
  }
}
