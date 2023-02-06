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
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.user.deleteMany();
};

const bekiriUsername = 'valmir_bekiri';
const simonUsername = 'simonostini';
const juryUsers = [{}];

const createUsers = async () => {
  const users = [
    {
      username: simonUsername,
      email: 'simonostini@gmail.com',
      firstname: 'Simon',
      lastname: 'Ostini',
      role: Role.USER,
      password: await argon.hash('testtest'),
      active: true,
    },
    {
      username: bekiriUsername,
      email: 'valmir.bekiri@hak-bregenz.at',
      firstname: 'Valmir',
      lastname: 'Bekiri',
      role: Role.USER,
      password: await argon.hash('testtest'),
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
      name: 'Generationen Park Mariahilf',
      address: 'Mariahilfstraße 50, 6900 Bregenz',
      image: 'parks/generationen-park-mariahilf.png',
      qr: 'not-yet-defined-0',
      gmaps: 'https://goo.gl/maps/R5LVWh3DZD27ViwXA',
      coordinates: {
        latitude: 47.49504770373178,
        longitude: 9.728410353659996,
      },
    },
    {
      id: 2,
      name: 'Jugendplatz Spielfeld 3',
      address: 'Achsiedlungsstraße 93, 6900 Bregenz',
      image: 'parks/jugendplatz-spielfeld-3.png',
      qr: 'not-yet-defined-1',
      gmaps: 'https://goo.gl/maps/rRa2EQv8ZBmp7Du86',
      coordinates: {
        latitude: 47.498879742248256,
        longitude: 9.7036399397155,
      },
    },
    {
      id: 3,
      name: 'Parkourpark Remise',
      address: 'Badgässele 2, 6900 Bregenz',
      image: 'parks/parkourpark-remise.png',
      qr: 'not-yet-defined-2',
      gmaps: 'https://goo.gl/maps/7rtaEfM9dVew7KWm8',
      coordinates: {
        latitude: 47.50271455933779,
        longitude: 9.73657343480402,
      },
    },
    {
      id: 4,
      name: 'Schulsportplatz MS Stadt',
      address: 'Schillerstraße 7, 6900 Bregenz',
      image: 'parks/schulsportplatz-ms-stadt.png',
      qr: 'not-yet-defined-3',
      gmaps: 'https://goo.gl/maps/eBj3bP1BdhekjLzx9',
      coordinates: {
        latitude: 47.504987444727035,
        longitude: 9.751705840629597,
      },
    },
    {
      id: 5,
      name: 'DigBiz Award Bühne',
      address: 'Hinterfeldgasse 19, 6900 Bregenz',
      image: 'parks/digbiz-award-bühne.jpg',
      qr: 'not-yet-defined-4',
      gmaps: 'https://goo.gl/maps/eBj3bP1BdhekjLzx9',
      coordinates: {
        latitude: 47.49154238414924,
        longitude: 9.72443860490714,
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
      name: 'Ausfallschritt',
      description:
        'Setze einen Fuß etwas weiter als Schrittlänge nach vorne. Beuge kontrolliert deine Beine, bis sie jeweils etwa zu 90 Grad angewinkelt sind. Oberkörper gerade halten. Durch die Bewegung sinkt deine Hüfte nach unten. Hinteres Knie berührt nun fast den Boden. Arme bleiben unbewegt.',
      execution:
        '15 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
      muscles: 'Beinstrecker, Beinbeuger, großer Gesäßmuskel',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'not-yet-defined',
    },
    {
      name: 'Ausfallschritt springend',
      description:
        'Setze einen Fuß etwas weiter als Schrittlänge nach vorne. Beuge kontrolliert deine Beine, bis sie jeweils etwa zu 90 Grad angewinkelt sind. Oberkörper gerade halten. Durch die Bewegung sinkt deine Hüfte nach unten. Hinteres Knie berührt nun fast den Boden. Während du dich wieder nach oben begibst, springst du hoch und wechselst das Bein Arme bleiben unbewegt.',
      execution:
        '15 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
      muscles: 'Beinstrecker, Beinbeuger, großer Gesäßmuskel',
      coins: 10,
      difficulty: DifficultyType.ADVANCED,
      video: 'not-yet-defined',
    },
    {
      name: 'Burpee bloße Ausführung',
      description:
        'Du gehst tief in eine Kniebeuge und platzierst deine Handflächen auf dem Boden. Dann springst du nach hinten in eine Plank-Position und machst einen Liegestütz. Anschließend springst du wieder nach vorne in die Kniebeuge und machst einen Strecksprung nach oben. Fertig!',
      execution: 'Langsam probieren!',
      muscles:
        'Core-Muskulatur, Brustmuskeln, Trizeps, Beinmuskulatur, Gesäßmuskeln',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'not-yet-defined',
    },
    {
      name: 'Burpee',
      description:
        'Du gehst tief in eine Kniebeuge und platzierst deine Handflächen auf dem Boden. Dann springst du nach hinten in eine Plank-Position und machst einen Liegestütz. Anschließend springst du wieder nach vorne in die Kniebeuge und machst einen Strecksprung nach oben. Fertig!',
      execution: 'So oft wie möglich in 1 Minute!\n(30-40 = Spitzenleistung)',
      muscles:
        'Core-Muskulatur, Brustmuskeln, Trizeps, Beinmuskulatur, Gesäßmuskeln',
      coins: 10,
      difficulty: DifficultyType.ADVANCED,
      video: 'not-yet-defined',
    },
    {
      name: 'Planks',
      description:
        'Die Ellenbogen sind unter den Schultern, der Unterarm senkrecht zum Körper, Handfläche auf dem Boden, Füße liegen übereinander. Presse deinen Unterarm in den Boden und strecke die Hüften Richtung Decke nach oben.',
      execution: 'ca 10-15 Sekunden halten',
      muscles:
        'Bauchmuskulatur, Beinmuskulatur, Armmuskulatur, Hüftmuskulatur, Gesäßmuskulatur, Tiefe Rumpf- und Rückenmuskulatur',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'not-yet-defined',
    },
    {
      name: 'Liegestütz',
      description:
        'Die Finger zeigen nach vorne, die Daumen nach innen. Durch gleichzeitiges Anspannen der Arme werden diese gestreckt und der Oberkörper hebt vom Boden ab. Das Gewicht wird gleichmäßig auf Zehenspitzen und Händen verteilt. Kopf, Hals, Wirbelsäule, Gesäß und Knie bilden eine Linie und die Bauchmuskulatur ist angespannt.',
      execution:
        '10 Wiederholungen mit jeweils 4 Sätzen\n1 Minute Pause dazwischen',
      muscles: 'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
      coins: 10,
      difficulty: DifficultyType.ADVANCED,
      video: 'not-yet-defined',
    },
    {
      name: 'Liegestütz mit Erhöhung',
      description:
        'Die Finger zeigen nach vorne, die Daumen nach innen. Durch gleichzeitiges Anspannen der Arme werden diese gestreckt und der Oberkörper hebt von der Bank ab. Das Gewicht wird gleichmäßig auf Zehenspitzen und Händen verteilt. Kopf, Hals, Wirbelsäule, Gesäß und Knie bilden eine Linie und die Bauchmuskulatur ist angespannt.',
      execution:
        '10 Wiederholungen mit jeweils 3-4 Sätzen\n1 Minute Pause dazwischen',
      muscles: 'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'not-yet-defined',
    },
    {
      name: 'Wandsitzen am Stamm',
      description:
        'Stelle dich etwa einen Schritt entfernt mit dem Rücken zum Stamm. Deine Füße sind hüftbreit voneinander entfernt. Drehe die Füße jeweils leicht nach außen. Lehne dich mit geradem Rücken an den Stamm. Beide Beine sind nun diagonal. Deine Arme lässt du neben deinem Körper nach unten hängen.',
      execution: 'ca. 30 Sekunden halten',
      muscles: 'Quadrizeps, Gesäßmuskel',
      coins: 10,
      difficulty: DifficultyType.BEGINNER,
      video: 'not-yet-defined',
    },
    {
      name: 'Einbeiniges Wandsitzen am Stamm',
      description:
        'Stelle dich etwa einen Schritt entfernt mit dem Rücken zum Stamm. Deine Füße sind hüftbreit voneinander entfernt. Drehe die Füße jeweils leicht nach außen. Lehne dich mit geradem Rücken an den Stamm. Erhebe nun ein Bein und versuche es auszustrecken. Deine Arme lässt du neben deinem Körper nach unten hängen.',
      execution: 'ca. 30 Sekunden halten',
      muscles: 'Quadrizeps, Gesäßmuskel',
      coins: 10,
      difficulty: DifficultyType.ADVANCED,
      video: 'not-yet-defined',
    },
    {
      name: 'Up and Down Planks',
      description:
        'Spanne Deinen Bauch und Dein Gesäß bewusst an. Wenn Du Deine Arme abwechselnd streckst und absenkst, musst Du weiterhin die Körperspannung halten können. Sollte Dir dies noch Schwierigkeiten bereiten, kein Problem. Setze einfach Deine Knie auf dem Boden ab und verringere hierdurch den Hebel und die Schwierigkeit.',
      execution: '10 Wiederholungen',
      muscles:
        'Bauchmuskulatur, Beinmuskulatur, Armmuskulatur, Hüftmuskulatur, Gesäßmuskulatur, Tiefe Rumpf- und Rückenmuskulatur',
      coins: 10,
      difficulty: DifficultyType.ADVANCED,
      video: 'not-yet-defined',
    },
    {
      name: 'Ochs am Berg',
      description:
        'Es wird ein Ochs bestimmt, welcher sich an einem Baum oder einer Wand positioniert. Die restlichen Schüler stellen sich mindestens 10 Meter vom Ochs entfernt auf.\n\n\
              Der Ochs wendet sein Gesicht von der Gruppe ab, zählt bis drei und ruft: “Eins, zwei, drei, Ochs am Berg!” Danach dreht er sich um. Solange der Ochs ruft, rennen die restlichen Spieler auf den Ochs zu. Beim Wort Berg müssen die Schüler stehen bleiben und dürfen sich nicht mehr bewegen. Wird ein Schüler in der Bewegung erwischt, muss dieser wieder zurück an den Anfang.',
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
  const bekiri = await prisma.user.findUnique({
    where: { username: bekiriUsername },
  });
  const simon = await prisma.user.findUnique({
    where: { username: simonUsername },
  });
  const restUsers = users.filter(
    (u) => ![bekiriUsername, simonUsername].includes(u.username ?? '')
  );
  const tempExercises = await prisma.exercise.findMany({
    include: { parks: true },
  });
  const exercises = [...new Array(4).fill(tempExercises).flatMap((e) => e)];

  await prisma.user.update({
    where: { username: bekiriUsername },
    data: {
      activities: {
        createMany: {
          data: [...exercises, ...exercises.slice(3)].map((exercise) => {
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

  await prisma.user.update({
    where: { username: simonUsername },
    data: {
      activities: {
        createMany: {
          data: exercises.slice(exercises.length / 1.5).map((exercise) => {
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

  await Promise.all(
    restUsers.map(async (user) => {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          activities: {
            createMany: {
              data: exercises
                .slice(Math.random() * exercises.length)
                .map((exercise) => {
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
