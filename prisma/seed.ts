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
        coins: 100,
      },
    ],
  });
};

const createExercises = async () => {
  await prisma.exercise.deleteMany();
  const parks = await prisma.park.findMany();

  await prisma.exercise.createMany({
    data: [
      {
        name: 'Sit-Up',
        description: 'Some description',
        difficulty: 'BEGINNER',
        points: 10,
        video: 'not-yet-defined',
      },
      {
        name: 'Liegestütze',
        description: 'Some description',
        difficulty: 'BEGINNER',
        points: 10,
        video: 'not-yet-defined',
      },
      {
        name: 'Plank',
        description: 'Some description',
        difficulty: 'BEGINNER',
        points: 10,
        video: 'not-yet-defined',
      },
    ],
  });

  const exercises = await prisma.exercise.findMany();

  await Promise.all([
    parks.map((park) => {
      exercises.map(async (exercise, i) => {
        prisma.park.update({
          where: { id: park.id },
          data: { exercises: { connect: { id: exercises[i].id } } },
        });
      });
    }),
  ]);
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
  await createExercises();
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
