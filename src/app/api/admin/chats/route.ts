import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    const sessionsWithCount = await Promise.all(
      sessions.map(async (s: any) => {
        const count = await prisma.chatMessage.count({ where: { sessionId: s.id } })
        return { ...s, _count: { messages: count } }
      })
    )
    return NextResponse.json({ sessions: sessionsWithCount })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch chat sessions' }, { status: 500 })
  }
}
