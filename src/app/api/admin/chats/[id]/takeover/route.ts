import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { isAdminTakeover, message } = body

    const session = await prisma.chatSession.findUnique({ where: { id } })
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const updated = await prisma.chatSession.update({
      where: { id },
      data: { isAdminTakeover },
    })

    if (message) {
      await prisma.chatMessage.create({
        data: {
          content: message,
          sender: 'Admin',
          isAdmin: true,
          isRead: true,
          sessionId: id,
        },
      })
    }

    return NextResponse.json({ session: updated })
  } catch (error) {
    console.error('Error updating takeover:', error)
    return NextResponse.json({ error: 'Failed to update takeover' }, { status: 500 })
  }
}
