import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as argon from 'argon2';

const createUsers = async () => {
  await prisma.user.deleteMany();
  const password = await argon.hash('some-secret-password');
  await prisma.user.createMany({
    data: [
      {
        username: 'simonostini',
        email: 'simonostini@gmail.com',
        isEmailConfirmed: true,
        firstname: 'Simon',
        lastname: 'Ostini',
        role: 'USER',
        password: password,
        profilePicture: 'path/to/picture',
        coins: 100,
      },
    ],
  });
};

const createParks = async () => {
  await prisma.park.deleteMany();
  await prisma.park.createMany({
    data: [
      {
        name: 'Rieden Vorkloster',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-0',
      },
      {
        name: 'Rieden Vorkloster',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-1',
      },
      {
        name: 'Rieden Vorkloster',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-2',
      },
      {
        name: 'Rieden Vorkloster',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-3',
      },
    ],
  });
};

const main = async () => {
  await createUsers();
  await createParks();
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
