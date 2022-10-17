import * as argon from 'argon2';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

const purgeDatabase = async () => {
  await prisma.activity.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.park.deleteMany();
  await prisma.user.deleteMany();
};

const createUsers = async () => {
  await prisma.user.createMany({
    data: [
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
        profilePicture: '6dad6d66-02b7-450b-9248-94a8c30563a6.jpeg',
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
    ],
  });
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
  const exercises = [
    {
      id: 1,
      name: 'Sit-Up',
      description: 'Some description',
      difficulty: 'BEGINNER',
      points: 10,
      video: 'not-yet-defined',
    },
    {
      id: 2,
      name: 'Liegestütze',
      description: 'Some description',
      difficulty: 'BEGINNER',
      points: 10,
      video: 'not-yet-defined',
    },
    {
      id: 3,
      name: 'Plank',
      description: 'Some description',
      difficulty: 'ADVANCED',
      points: 10,
      video: 'not-yet-defined',
    },
    {
      id: 4,
      name: 'Squat',
      description: 'Some description',
      difficulty: 'BEGINNER',
      points: 10,
      video: 'not-yet-defined',
    },
    {
      id: 5,
      name: 'Versteinerte Hexe',
      description: 'Some description',
      difficulty: 'GAME',
      points: 10,
      video: 'not-yet-defined',
    },
  ];

  await Promise.all([
    exercises.map(async (exercise) => {
      await prisma.exercise.create({
        data: <any>{
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

const deleteUnusedProfileImg = async () => {
  const imgPath = path.join(
    process.cwd(),
    `${process.env['NX_API_UPLOADS_FOLDER']}/profile-pictures`
  );

  const usedImg = (
    await prisma.user.findMany({
      where: { profilePicture: { not: null } },
      select: { profilePicture: true },
    })
  ).map((p) => p.profilePicture ?? '');

  const allImg = await util.promisify(fs.readdir)(imgPath);

  console.log(usedImg);
  console.log(allImg);

  allImg.forEach(
    async (f) =>
      usedImg.indexOf(f) === -1 &&
      (await util.promisify(fs.unlink)(path.join(imgPath, f)))
  );
};

const main = async () => {
  await purgeDatabase();
  await createUsers();
  await createParks();
  await createExercises();
  await createActivities();
  await deleteUnusedProfileImg();
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
