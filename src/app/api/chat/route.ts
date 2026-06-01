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
    const { content, sessionId } = body

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://client-indurpuram.vercel.app',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct-v0.1',
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

    return Response.json({ success: true, reply, message: { content: reply }, sessionId }, { status: 201 })
  } catch {
    return Response.json({ success: true, reply: 'Thank you! Our team will get back to you shortly.', message: { content: 'Thank you! Our team will get back to you shortly.' } }, { status: 201 })
  }
}
