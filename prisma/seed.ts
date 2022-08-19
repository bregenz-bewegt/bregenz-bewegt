import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {};

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
