import { PrismaClient, Role, DifficultyType } from '@prisma/client';
const prisma = new PrismaClient();
import * as argon from 'argon2';
import { faker } from '@faker-js/faker';

const purgeDatabase = async () => {
  await prisma.activity.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.park.deleteMany();
  await prisma.difficulty.deleteMany();
  await prisma.preferences.deleteMany();
  await prisma.user.deleteMany();
};

const createUsers = async () => {
  const users = [
    {
      username: 'simonostini',
      email: 'simonostini@gmail.com',
      firstname: 'Simon',
      lastname: 'Ostini',
      role: Role.USER,
      password: await argon.hash('testtest'),
      coins: 800,
      active: true,
    },
    {
      username: 'Vincentcool3',
      email: 'stadelmann.timon@gmail.com',
      firstname: 'Timon',
      lastname: 'Stadelmann',
      role: Role.USER,
      password: await argon.hash('timonovich'),
      coins: 1000,
      active: true,
    },
    ...(await Promise.all([
      ...new Array(200).fill(null).map(async () => ({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        role: Role.USER,
        password: await argon.hash('testtest'),
        coins: Math.floor(Math.random() * (100 + 1)) * 10,
        active: true,
      })),
    ])),
  ];

  await Promise.all([
    users.map(async (user) => {
      await prisma.user.create({
        data: {
          ...user,
          preferences: {
            create: {
              public: true,
              difficulties: {
                connect: (
                  await prisma.difficulty.findMany()
                ).map((d) => ({ id: d.id })),
              },
            },
          },
        },
      });
    }),
  ]);
};

const createParks = async () => {
  await prisma.park.createMany({
    data: [
      {
        id: 1,
        name: 'Parkourpark Remise',
        address: 'Badgässele',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-0',
      },
      {
        id: 2,
        name: 'Schulsportplatz MS Start',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-1',
      },
      {
        id: 3,
        name: 'Jugenplatz Spielfeld 3',
        address: 'Achstraße',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-2',
      },
      {
        id: 4,
        name: 'Generationen Park Mariahilf',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-3',
      },
      {
        id: 5,
        name: 'Schulsportplatz VS Weidach',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-4',
      },
      {
        id: 6,
        name: 'Schlossberg Trail',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-5',
      },
      {
        id: 7,
        name: 'Tschutterplatz beim Stadion',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-6',
      },
      {
        id: 8,
        name: 'Schulsportplatz VS Augasse',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-7',
      },
      {
        id: 9,
        name: 'Schulplatz VS Rieden',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-8',
      },
      {
        id: 10,
        name: 'Schulsportplatz MS Schendlingen',
        address: 'Rotfarbgasse 14a, 6900 Bregenz',
        image: 'https://picsum.photos/400/200',
        qr: 'not-yet-defined-9',
      },
    ],
  });
};

const createExercises = async () => {
  const parks = await prisma.park.findMany();
  const difficulties = await prisma.difficulty.findMany();
  const exercises = [
    {
      name: 'Sit-Up',
      description: 'Some description',
      difficulty: {
        connect: {
          id: difficulties.find((d) => d.difficulty === DifficultyType.BEGINNER)
            ?.id,
        },
      },
      points: 10,
      video: 'not-yet-defined',
    },
    {
      name: 'Liegestütze',
      description: 'Some description',
      difficulty: {
        connect: {
          id: difficulties.find((d) => d.difficulty === DifficultyType.BEGINNER)
            ?.id,
        },
      },
      points: 10,
      video: 'not-yet-defined',
    },
    {
      name: 'Plank',
      description: 'Some description',
      difficulty: {
        connect: {
          id: difficulties.find((d) => d.difficulty === DifficultyType.ADVANCED)
            ?.id,
        },
      },
      points: 10,
      video: 'not-yet-defined',
    },
    {
      name: 'Squat',
      description: 'Some description',
      difficulty: {
        connect: {
          id: difficulties.find((d) => d.difficulty === DifficultyType.BEGINNER)
            ?.id,
        },
      },
      points: 10,
      video: 'not-yet-defined',
    },
    {
      name: 'Versteinerte Hexe',
      description: 'Some description',
      difficulty: {
        connect: {
          id: difficulties.find((d) => d.difficulty === DifficultyType.GAME)
            ?.id,
        },
      },
      points: 10,
      video: 'not-yet-defined',
    },
  ];

  await Promise.all([
    exercises.map(async (exercise) => {
      await prisma.exercise.create({
        data: {
          ...exercise,
          parks: {
            connect: parks.map((park) => ({ id: park.id })),
          },
        },
      });
    }),
  ]);
};

const createActivities = async () => {
  const users = await prisma.user.findMany();
  const exercises = await prisma.exercise.findMany();

  await Promise.all([
    users.map(async (user) => {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          activities: {
            createMany: {
              data: await Promise.all(
                exercises.map(async (exercise) => ({
                  startedAt: new Date(),
                  endedAt: new Date(),
                  exerciseId: exercise.id,
                }))
              ),
            },
          },
        },
      });
    }),
  ]);
};

const createDifficulties = async () => {
  await Promise.all([
    Object.values(DifficultyType).map(async (difficulty, i) => {
      await prisma.difficulty.create({
        data: {
          id: i + 1,
          difficulty,
        },
      });
    }),
  ]);
};

const main = async () => {
  await purgeDatabase();
  createDifficulties().then(async () => {
    await createUsers();
    await createParks();
    await createExercises();
    await createActivities();
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
