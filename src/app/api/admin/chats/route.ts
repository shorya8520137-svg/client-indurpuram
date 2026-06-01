import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { messages: true } },
      },
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 })
  }
}
