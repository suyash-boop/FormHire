import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const post = await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  })
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })