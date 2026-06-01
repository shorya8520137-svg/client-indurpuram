export function GET() {
  return Response.json({ status: 'Chat API ready' })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, name } = body
    const reply = `Thank you for your message${name ? `, ${name}` : ''}! Our team will get back to you shortly. For immediate assistance, please call our clinic.`
    return Response.json({ success: true, reply, message: { content: reply } }, { status: 201 })
  } catch {
    return Response.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
