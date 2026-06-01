import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get('staffId')
    const where = staffId ? { staffId } : {}
    const attendance = await prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { staff: { select: { name: true, email: true } } },
    })
    return NextResponse.json({ attendance })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { staffId, verifiedBy } = body
    const attendance = await prisma.attendance.create({
      data: {
        staffId,
        checkIn: new Date(),
        date: new Date(),
        verifiedBy: verifiedBy || 'manual',
      },
    })
    return NextResponse.json({ attendance }, { status: 201 })
  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json({ error: 'Failed to create attendance' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id } = body
    const attendance = await prisma.attendance.update({
      where: { id },
      data: { checkOut: new Date() },
    })
    return NextResponse.json({ attendance })
  } catch (error) {
    console.error('Error updating attendance:', error)
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 })
  }
}
