export function GET() {
  return Response.json({ status: 'Chat API ready' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ success: true, message: body }, { status: 201 })
}
