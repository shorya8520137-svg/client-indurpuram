import { NextResponse } from 'next/server'

let prismaClient: any = null

async function getPrisma() {
  if (!prismaClient) {
    try {
      const { prisma } = await import('@/lib/prisma')
      prismaClient = prisma
    } catch {
      return null
    }
  }
  return prismaClient
}

export async function GET() {
  const prisma = await getPrisma()
  if (!prisma) {
    return NextResponse.json([])
  }
  try {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(invoices)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const prisma = await getPrisma()
  if (!prisma) {
    return NextResponse.json({ success: true })
  }
  try {
    const body = await request.json()
    const { patientName, patientEmail, patientPhone, items, tax, discount } = body

    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const count = await prisma.invoice.count()
    const invoiceNo = `INV-${dateStr}-${String(count + 1).padStart(4, '0')}`

    const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.rate, 0)
    const taxAmount = subtotal * (tax / 100)
    const total = subtotal + taxAmount - (discount || 0)

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        patientName,
        patientEmail,
        patientPhone,
        subtotal,
        tax,
        discount: discount || 0,
        total,
        items: {
          create: items.map((item: any) => ({
            serviceName: item.serviceName,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
