import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as argon from 'argon2';

const createUsers = async () => {
  await prisma.user.deleteMany();
  const password = await argon.hash('test');
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
        profilePicture: 'https://i.pravatar.cc/150?img=4',
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
        name: 'Parkourpark Remise',
        address: 'Badgässele',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-0',
      },
      {
        name: 'Schulsportplatz MS Start',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-1',
      },
      {
        name: 'Jugenplatz Spielfeld 3',
        address: 'Achstraße',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-2',
      },
      {
        name: 'Generationen Park Mariahilf',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-3',
      },
      {
        name: 'Schulsportplatz VS Weidach',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-4',
      },
      {
        name: 'Schlossberg Trail',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-5',
      },
      {
        name: 'Tschutterplatz beim Stadion',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-6',
      },
      {
        name: 'Schulsportplatz VS Augasse',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-7',
      },
      {
        name: 'Schulplatz VS Rieden',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-8',
      },
      {
        name: 'Schulsportplatz MS Schendlingen',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-9',
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
