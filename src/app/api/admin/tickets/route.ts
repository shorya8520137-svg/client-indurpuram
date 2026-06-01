import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tickets = await prisma.maintenanceTicket.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, equipment, priority, reportedBy } = body
    const ticket = await prisma.maintenanceTicket.create({
      data: { title, description, equipment, priority, reportedBy },
    })
    return NextResponse.json({ ticket }, { status: 201 })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, assignedTo } = body
    const ticket = await prisma.maintenanceTicket.update({
      where: { id },
      data: { ...(status && { status }), ...(assignedTo !== undefined && { assignedTo }) },
    })
    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}
