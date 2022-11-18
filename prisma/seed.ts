import * as argon from 'argon2';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { PrismaClient, Role, DifficultyType, Park } from '@prisma/client';
const prisma = new PrismaClient();

const purgeDatabase = async () => {
  await prisma.activity.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.coordinates.deleteMany();
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
      active: true,
    },
    {
      username: 'Vincentcool3',
      email: 'stadelmann.timon@gmail.com',
      firstname: 'Timon',
      lastname: 'Stadelmann',
      role: Role.USER,
      password: await argon.hash('timonovich'),
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
  const parks = [
    {
      id: 1,
      name: 'Parkourpark Remise',
      address: 'Badgässele',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-0',
      coordinates: {
        latitude: 47.498273,
        longitude: 9.703772,
      },
    },
    {
      id: 2,
      name: 'Schulsportplatz MS Start',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-1',
      coordinates: {
        latitude: 47.505646,
        longitude: 9.751746,
      },
    },
    {
      id: 3,
      name: 'Jugendplatz Spielfeld 3',
      address: 'Achstraße',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-2',
      coordinates: {
        latitude: 47.501583,
        longitude: 9.738889,
      },
    },

    {
      id: 4,
      name: 'Generationen Park Mariahilf',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-3',
      coordinates: { latitude: 47.495515, longitude: 9.746912 },
    },
    {
      id: 5,
      name: 'Schulsportplatz VS Weidach',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-4',
      coordinates: {
        latitude: 47.491353,
        longitude: 9.739731,
      },
    },

    {
      id: 6,
      name: 'Schlossberg Trail',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-5',
      coordinates: {
        latitude: 47.506375,
        longitude: 9.7387,
      },
    },

    {
      id: 7,
      name: 'Tschutterplatz beim Stadion',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-6',
      coordinates: {
        latitude: 47.503531,
        longitude: 9.734675,
      },
    },

    {
      id: 8,
      name: 'Schulsportplatz VS Augasse',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-7',
      coordinates: {
        latitude: 47.500276,
        longitude: 9.738716,
      },
    },

    {
      id: 9,
      name: 'Schulplatz VS Rieden',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-8',
      coordinates: {
        latitude: 47.49278,
        longitude: 9.723823,
      },
    },
    {
      id: 10,
      name: 'Schulsportplatz MS Schendlingen',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-9',
      coordinates: {
        latitude: 47.492634,
        longitude: 9.715304,
      },
    },
  ];

  await Promise.all(
    parks.map(async (park) => {
      const { coordinates, ...parkOnly } = park;
      await prisma.park.create({
        data: {
          ...parkOnly,
          coordinates: {
            create: coordinates,
          },
        },
      });
    })
  );
};

const createExercises = async () => {
  const difficulties = await prisma.difficulty.findMany();
  const parks = await prisma.park.findMany();
  const exercises = [
    {
      name: 'Sit-Up',
      description: 'some description',
      execution: 'some execution detials',
      muscles: 'some muscles that are used',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'not-yet-defined',
    },
    {
      name: 'Liegestütze',
      description: 'some description',
      execution: 'some execution detials',
      muscles: 'some muscles that are used',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'not-yet-defined',
    },
    {
      name: 'Plank',
      description: 'some description',
      execution: 'some execution detials',
      muscles: 'some muscles that are used',
      coins: 10,
      difficulty: DifficultyType.ADVANCED,
      video: 'not-yet-defined',
    },
    {
      name: 'Squat',
      description: 'some description',
      execution: 'some execution detials',
      muscles: 'some muscles that are used',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'not-yet-defined',
    },
    {
      name: 'Versteinerte Hexe',

      description: 'some description',
      execution: 'some execution detials',
      muscles: 'some muscles that are used',
      coins: 10,
      difficulty: DifficultyType.GAME,
      video: 'not-yet-defined',
    },
  ];

  await Promise.all(
    exercises.map(async (exercise) => {
      await prisma.exercise.create({
        data: {
          ...exercise,
          difficulty: {
            connect: {
              id: difficulties.find((d) => d.difficulty === exercise.difficulty)
                ?.id,
            },
          },
          parks: {
            connect: parks.map((park) => ({ id: park.id })),
          },
        },
      });
    })
  );
};

const createActivities = async () => {
  const users = await prisma.user.findMany();
  const exercises = await prisma.exercise.findMany({
    include: { parks: true },
  });

  await Promise.all(
    users.map(async (user) => {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          activities: {
            createMany: {
              data: exercises.map((exercise) => {
                const date = randomDate();
                return {
                  startedAt: date,
                  endedAt: date,
                  exerciseId: exercise.id,
                  parkId:
                    exercise.parks[
                      Math.floor(Math.random() * exercise.parks.length)
                    ].id,
                };
              }),
            },
          },
        },
      });
    })
  );
};

const randomDate = () => {
  const t = new Date();
  t.setDate(1);
  t.getMonth() > 0 && t.setMonth(t.getMonth() - 1);
  return new Date(
    +t.getTime() + Math.random() * (new Date().getTime() - t.getTime())
  );
};

const deleteUnusedProfilePictures = async () => {
  const imgPath = path.join(
    process.cwd(),
    'static',
    process.env['NX_UPLOADS_FOLDER'] ?? 'uploads',
    'profile-pictures'
  );

  const usedImg = (
    await prisma.user.findMany({
      where: { profilePicture: { not: null } },
      select: { profilePicture: true },
    })
  ).map((p) => p.profilePicture ?? '');

  const allImg = await util.promisify(fs.readdir)(imgPath);

  allImg.forEach(
    async (f) =>
      !usedImg.includes(f) &&
      (await util.promisify(fs.unlink)(path.join(imgPath, f)))
  );
};

const createDifficulties = async () => {
  await Promise.all(
    Object.values(DifficultyType).map(async (difficulty, i) => {
      await prisma.difficulty.create({
        data: {
          id: i + 1,
          difficulty,
        },
      });
    })
  );
};

const main = async () => {
  await purgeDatabase();
  await createDifficulties();
  await createUsers();
  await createParks();
  await createExercises();
  await createActivities();
  await deleteUnusedProfilePictures();
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
