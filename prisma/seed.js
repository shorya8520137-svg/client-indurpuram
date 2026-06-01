const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@wasidental.com' },
    update: {},
    create: {
      email: 'admin@wasidental.com',
      password: 'admin123',
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log('Admin created:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
