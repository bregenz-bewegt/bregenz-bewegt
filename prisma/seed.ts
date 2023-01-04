import * as argon from 'argon2';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { PrismaClient, Role, DifficultyType } from '@prisma/client';
const prisma = new PrismaClient();

const purgeDatabase = async () => {
  await prisma.activity.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.coordinates.deleteMany();
  await prisma.park.deleteMany();
  await prisma.difficulty.deleteMany();
  await prisma.preferences.deleteMany();
  await prisma.friendRequest.deleteMany();
  await prisma.notification.deleteMany();
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
      image: 'parks/parkourpark-remise.png',
      qr: 'not-yet-defined-0',
      coordinates: {
        latitude: 47.50271455933779,
        longitude: 9.73657343480402,
      },
    },
    {
      id: 2,
      name: 'Schulsportplatz MS Stadt',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'parks/schulsportplatz-ms-stadt.png',
      qr: 'not-yet-defined-1',
      coordinates: {
        latitude: 47.504987444727035,
        longitude: 9.751705840629597,
      },
    },
    {
      id: 3,
      name: 'Jugendplatz Spielfeld 3',
      address: 'Achsiedlungsstraße 93, 6900 Bregenz',
      image: 'parks/jugendplatz-spielfeld.png',
      qr: 'not-yet-defined-2',
      coordinates: {
        latitude: 47.498879742248256,
        longitude: 9.7036399397155,
      },
    },

    {
      id: 4,
      name: 'Generationen Park Mariahilf',
      address: 'Mariahilfstraße 50, 6900 Bregenz',
      image: 'parks/generationen-park-mariahilf.png',
      qr: 'not-yet-defined-3',
      coordinates: {
        latitude: 47.49504770373178,
        longitude: 9.728410353659996,
      },
    },
    {
      id: 5,
      name: 'Schulsportplatz VS Weidach',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'parks/schulsportplatz-vs-weidach.png',
      qr: 'not-yet-defined-4',
      coordinates: {
        latitude: 47.49138263547858,
        longitude: 9.739739264076317,
      },
    },

    {
      id: 6,
      name: 'Schlossberg Trail',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'parks/schlossberg-trail.png',
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
      image: 'parks/tschutterplatz-beim-stadion.png',
      qr: 'not-yet-defined-6',
      coordinates: {
        latitude: 47.50383807029892,
        longitude: 9.73433812513105,
      },
    },

    {
      id: 8,
      name: 'Schulsportplatz VS Augasse',
      address: 'Rotfarbgasse 14a, 6900 Bregenz',
      image: 'parks/schulsportplatz-vs-augasse.png',
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
      image: 'parks/schulsportplatz-vs-augasse.png',
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
      image: 'parks/schulsportplatz-ms-schendlingen.png',
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
      video: 'exercises/situp.mp4',
    },
    {
      name: 'Liegestütze',
      description: 'some description',
      execution: 'some execution detials',
      muscles: 'some muscles that are used',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'exercises/situp.mp4',
    },
    {
      name: 'Plank',
      description: 'some description',
      execution: 'some execution detials',
      muscles: 'some muscles that are used',
      coins: 10,
      difficulty: DifficultyType.ADVANCED,
      video: 'exercises/situp.mp4',
    },
    {
      name: 'Squat',
      description: 'some description',
      execution: 'some execution detials',
      muscles: 'some muscles that are used',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'exercises/situp.mp4',
    },
    {
      name: 'Versteinerte Hexe',

      description: 'some description',
      execution: 'some execution detials',
      muscles: 'some muscles that are used',
      coins: 10,
      difficulty: DifficultyType.GAME,
      video: 'exercises/situp.mp4',
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
