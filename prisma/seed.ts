import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.createMany({
    data: [
      {
        username: 'simonostini',
        email: 'simonostini@gmail.com',
        isEmailConfirmed: true,
        firstname: 'Simon',
        lastname: 'Ostini',
        role: 'USER',
        password: 'my-secred-password',
        profilePicture: 'path/to/picture',
        coins: 100,
      },
    ],
  });
};

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
