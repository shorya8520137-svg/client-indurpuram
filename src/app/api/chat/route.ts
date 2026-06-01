const SYSTEM_PROMPT = `You are a helpful dental clinic assistant for Wasi Dental Clinic, a luxury dental clinic in Mumbai. 
Answer questions about:
- Services: dental implants, smile design, teeth whitening, root canals, veneers, Invisalign, laser dentistry, etc.
- Bookings and appointments
- Clinic location: Marine Drive, Mumbai
- Contact information

When a user wants to book an appointment:
1. Ask for their name, phone number, preferred date/time, and service needed
2. Once you have name + phone + service + date/time, say "I have all the details needed to book your appointment. Let me confirm: [summary]. I'll book it now."
3. Do NOT ask for details the user already provided
4. Available time slots: 9 AM to 4 PM, Mon-Sat
5. Be friendly, professional, and concise`

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

    const bookingMatch = content.match(/book|appointment|schedule|visit|confirm/i)

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

    const nameMatch = content.match(/(?:my name is|i am|i'm)\s+(\w+)/i) || content.match(/name[:\s]+(\w+)/i)
    const phoneMatch = content.match(/(\d{10})/)
    const timeMatch = content.match(/(\d{1,2})\s*(?:pm|am|:)/i)
    const extractedName = patientName || (nameMatch ? nameMatch[1] : null)
    const extractedPhone = patientPhone || (phoneMatch ? phoneMatch[1] : null)
    const extractedTime = timeMatch ? timeMatch[0] : null

    if (bookingMatch && extractedName && extractedPhone) {
      const service = await prisma.service.findFirst({ where: { isActive: true } })
      const doctor = await prisma.doctor.findFirst()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(10, 0, 0, 0)

      const appointmentData: any = {
        patientName: extractedName,
        email: patientEmail || '',
        phone: extractedPhone,
        notes: content,
        date: tomorrow,
        time: extractedTime || '10:00 AM',
        status: 'pending',
        serviceId: service?.id || '',
        doctorId: doctor?.id || '',
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
