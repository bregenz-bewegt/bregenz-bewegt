import { createResponseInterceptor } from './../libs/client/common/http/src/lib/interceptors/response.interceptor';
import { add } from 'ionicons/icons';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient, DifficultyType, Park } from '@prisma/client';
const prisma = new PrismaClient();

enum ExDescType {
  DESCRIPTION = 'DESCRIPTION',
  EXECUTION = 'EXECUTION',
  MUSCLES = 'MUSCLES',
}

const purgeDatabase = async () => {
  await prisma.exercise.deleteMany();
  await prisma.coordinates.deleteMany();
  await prisma.park.deleteMany();
  await prisma.difficulty.deleteMany();
};

const createParks = async () => {
  const difficulties = await prisma.difficulty.findMany();
  const parks = [
    {
      id: 1,
      name: 'Generationen Park Mariahilf',
      address: 'Mariahilfstraße 50, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-0',
      gmaps: 'https://goo.gl/maps/R5LVWh3DZD27ViwXA',
      coordinates: {
        latitude: 47.49504770373178,
        longitude: 9.728410353659996,
      },
      exercises: [
        {
          name: 'Liegestütz mit Erhöhung',
          description: {
            [ExDescType.DESCRIPTION]:
              'Die Finger zeigen nach vorne, die Daumen nach innen. Durch gleichzeitiges Anspannen der Arme werden diese gestreckt und der Oberkörper hebt von der Bank ab. Das Gewicht wird gleichmäßig auf Zehenspitzen und Händen verteilt. Kopf, Hals, Wirbelsäule, Gesäß und Knie bilden eine Linie und die Bauchmuskulatur ist angespannt.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3-4 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Liegestütz',
          description: {
            [ExDescType.DESCRIPTION]:
              'Die Finger zeigen nach vorne, die Daumen nach innen. Durch gleichzeitiges Anspannen der Arme werden diese gestreckt und der Oberkörper hebt vom Boden ab. Das Gewicht wird gleichmäßig auf Zehenspitzen und Händen verteilt. Kopf, Hals, Wirbelsäule, Gesäß und Knie bilden eine Linie und die Bauchmuskulatur ist angespannt.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 4 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Ausfallschritt',
          description: {
            [ExDescType.DESCRIPTION]:
              'Setze einen Fuß etwas weiter als Schrittlänge nach vorne. Beuge kontrolliert deine Beine, bis sie jeweils etwa zu 90 Grad angewinkelt sind. Oberkörper gerade halten. Durch die Bewegung sinkt deine Hüfte nach unten. Hinteres Knie berührt nun fast den Boden. Arme bleiben unbewegt.',
            [ExDescType.EXECUTION]:
              '15 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Beinstrecker, Beinbeuger, großer Gesäßmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Ausfallschritt springend',
          description: {
            [ExDescType.DESCRIPTION]:
              'Setze einen Fuß etwas weiter als Schrittlänge nach vorne. Beuge kontrolliert deine Beine, bis sie jeweils etwa zu 90 Grad angewinkelt sind. Oberkörper gerade halten. Durch die Bewegung sinkt deine Hüfte nach unten. Hinteres Knie berührt nun fast den Boden. Während du dich wieder nach oben begibst, springst du hoch und wechselst das Bein Arme bleiben unbewegt.',
            [ExDescType.EXECUTION]:
              '15 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Beinstrecker, Beinbeuger, großer Gesäßmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Burpee bloße Ausführung',
          description: {
            [ExDescType.DESCRIPTION]:
              'Du gehst tief in eine Kniebeuge und platzierst deine Handflächen auf dem Boden. Dann springst du nach hinten in eine Plank-Position und machst einen Liegestütz. Anschließend springst du wieder nach vorne in die Kniebeuge und machst einen Strecksprung nach oben. Fertig!',
            [ExDescType.EXECUTION]: 'Langsam probieren!',
            [ExDescType.MUSCLES]:
              'Core-Muskulatur, Brustmuskeln, Trizeps, Beinmuskulatur, Gesäßmuskeln',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Burpee',
          description: {
            [ExDescType.DESCRIPTION]:
              'Du gehst tief in eine Kniebeuge und platzierst deine Handflächen auf dem Boden. Dann springst du nach hinten in eine Plank-Position und machst einen Liegestütz. Anschließend springst du wieder nach vorne in die Kniebeuge und machst einen Strecksprung nach oben. Fertig!',
            [ExDescType.EXECUTION]:
              'So oft wie möglich in 1 Minute!\n(30-40 = Spitzenleistung)',
            [ExDescType.MUSCLES]:
              'Core-Muskulatur, Brustmuskeln, Trizeps, Beinmuskulatur, Gesäßmuskeln',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Wandsitzen am Stamm',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stelle dich etwa einen Schritt entfernt mit dem Rücken zum Stamm. Deine Füße sind hüftbreit voneinander entfernt. Drehe die Füße jeweils leicht nach außen. Lehne dich mit geradem Rücken an den Stamm. Beide Beine sind nun diagonal. Deine Arme lässt du neben deinem Körper nach unten hängen.',
            [ExDescType.EXECUTION]: 'ca. 30 Sekunden halten',
            [ExDescType.MUSCLES]: 'Quadrizeps, Gesäßmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Einbeiniges Wandsitzen am Stamm',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stelle dich etwa einen Schritt entfernt mit dem Rücken zum Stamm. Deine Füße sind hüftbreit voneinander entfernt. Drehe die Füße jeweils leicht nach außen. Lehne dich mit geradem Rücken an den Stamm. Erhebe nun ein Bein und versuche es auszustrecken. Deine Arme lässt du neben deinem Körper nach unten hängen.',
            [ExDescType.EXECUTION]: 'ca. 30 Sekunden halten',
            [ExDescType.MUSCLES]: 'Quadrizeps, Gesäßmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Planks',
          description: {
            [ExDescType.DESCRIPTION]:
              'Die Ellenbogen sind unter den Schultern, der Unterarm senkrecht zum Körper, Handfläche auf dem Boden, Füße liegen übereinander. Presse deinen Unterarm in den Boden und strecke die Hüften Richtung Decke nach oben.',
            [ExDescType.EXECUTION]: 'ca 10-15 Sekunden halten',
            [ExDescType.MUSCLES]:
              'Bauchmuskulatur, Beinmuskulatur, Armmuskulatur, Hüftmuskulatur, Gesäßmuskulatur, Tiefe Rumpf- und Rückenmuskulatur',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Up and Down Planks',
          description: {
            [ExDescType.DESCRIPTION]:
              'Spanne Deinen Bauch und Dein Gesäß bewusst an. Wenn Du Deine Arme abwechselnd streckst und absenkst, musst Du weiterhin die Körperspannung halten können. Sollte Dir dies noch Schwierigkeiten bereiten, kein Problem. Setze einfach Deine Knie auf dem Boden ab und verringere hierdurch den Hebel und die Schwierigkeit.',
            [ExDescType.EXECUTION]: '10 Wiederholungen',
            [ExDescType.MUSCLES]:
              'Bauchmuskulatur, Beinmuskulatur, Armmuskulatur, Hüftmuskulatur, Gesäßmuskulatur, Tiefe Rumpf- und Rückenmuskulatur',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Ochs am Berg',
          description: {
            [ExDescType.DESCRIPTION]:
              'Es wird ein Ochs bestimmt, welcher sich an einem Baum oder einer Wand positioniert. Die restlichen Schüler stellen sich mindestens 10 Meter vom Ochs entfernt auf.\n\n\
              Der Ochs wendet sein Gesicht von der Gruppe ab, zählt bis drei und ruft: “Eins, zwei, drei, Ochs am Berg!” Danach dreht er sich um. Solange der Ochs ruft, rennen die restlichen Spieler auf den Ochs zu. Beim Wort Berg müssen die Schüler stehen bleiben und dürfen sich nicht mehr bewegen. Wird ein Schüler in der Bewegung erwischt, muss dieser wieder zurück an den Anfang.',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find((d) => d.difficulty === DifficultyType.GAME)
                ?.id,
            },
          },
          video: 'not-yet-defined',
        },
      ],
    },
    {
      id: 2,
      name: 'Jugendplatz Spielfeld 3',
      address: 'Achsiedlungsstraße 93, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-1',
      gmaps: 'https://goo.gl/maps/rRa2EQv8ZBmp7Du86',
      coordinates: {
        latitude: 47.498879742248256,
        longitude: 9.7036399397155,
      },
      exercises: [
        {
          name: 'Hängen lassen (Ringe)',
          description: {
            [ExDescType.DESCRIPTION]:
              'Greift die 2 Ringe im Oberhandgriff (Finger vom Körper weg), Arme strecken, Körper ruhig hängen lassen (nicht Schwingen), Knie im rechten Winkel beugen',
            [ExDescType.EXECUTION]:
              '30 Sek jeweils 3 Sätze\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'oberer Rücken, Schultern, Ader, Unterarme, Hand- und Handgelenksbeuger',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Hangeln (Stange)',
          description: {
            [ExDescType.DESCRIPTION]:
              'Greift die Stange im Oberhandgriff (Finger vom Körper weg), Arme strecken, Knie im rechten Winkel beugen, eine Stange nach der anderen greifen',
            [ExDescType.EXECUTION]: '3 Runden\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'oberer Rücken, Schultern, Bizeps, Unterarme, Hand- und Handgelenksbeuger',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Supermann ausgestreckte Arme',
          description: {
            [ExDescType.DESCRIPTION]:
              'Bauchlage, Beine fast durchstrecken, Arme ausstrecken, Spannung aufbauen, gleichzeitig Arme und Beine bis zum Becken heben, hebe Kopf und Oberkörper ein kleines Stück vom Boden ab, Position kurzhalten, Arme; Beine; Kopf; Oberkörper wieder entspannt auf Boden legen',
            [ExDescType.EXECUTION]:
              '15 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]: 'Rückenstrecker, Gesäßmuskel, Beinbizeps',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Supermann angezogene Arme',
          description: {
            [ExDescType.DESCRIPTION]:
              'Bauchlage, Beine fast durchstrecken, Spannung aufbauen, gleichzeitig Arme und Beine bis zum Becken, hebe Kopf und Oberkörper ein kleines Stück vom Boden ab, Ellbogen ziehen nach hinten zum Rücken (Schulterblätter zusammen), Position kurzhalten, Arme; Beine; Kopf; Oberkörper wieder entspannt auf Boden legen',
            [ExDescType.EXECUTION]:
              '15 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]: 'Rückenstrecker, Gesäßmuskel, Beinbizeps',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Arm-/Beinheben im Vierfüßlerstand',
          description: {
            [ExDescType.DESCRIPTION]:
              'Ausgansposition Vierfüßlerstand -> Kopf verlängert Wirbelsäule, Bauch und Beckenboden anspannen, rechten Arm vom Boden abheben und ihn in Verlängerung des Oberkörpers weit nach vorne ausstrecken, linkes Bein anheben und in Verlängerung zum Rumpf gerade nach hinten ausstrecken, in Ausgansposition zurückkommen und Arm/Bein wechseln',
            [ExDescType.EXECUTION]:
              '15 Wiederholungen pro Bein jeweils 3 Sätze\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Rumpfmuskulatur, Rückenmuskulatur, Gesäßmuskulatur, Beinmuskulatur',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Arm-/Beinheben in Liegestützposition',
          description: {
            [ExDescType.DESCRIPTION]:
              'Ausgansposition Liegestützposition, Beine vollständig durchstrecken, Po Richtung Himmel, Rumpf anspannen, Bein vom Boden abheben und Bein parallel zum Boden ausrichten, Position für einige Sekunden halten und Bein wieder abstellen',
            [ExDescType.EXECUTION]:
              '15 Wiederholungen pro Bein jeweils 3 Sätze\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Rumpfmuskulatur, Rückenmuskulatur, Gesäßmuskulatur, Beinmuskulatur',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Trizepsstrecken am Boden',
          description: {
            [ExDescType.DESCRIPTION]:
              'Ausgansposition Unterarmstütz, Unterarme liegen auf dem Boden und Beine sind gestreckt, Arme komplett durchstrecken, langsam und kontrolliert in Ausgansposition zurück',
            [ExDescType.EXECUTION]:
              '8-10 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]: 'Trizeps, Brustmuskel, Bauchmuskulatur',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Diamant-Liegestütz',
          description: {
            [ExDescType.DESCRIPTION]:
              'Ausgansposition Liegestützposition, mit den Händen ein Diamant formen bzw. Dreieck, Rumpfmuskulatur anspannen und Arme leicht nach unten beugen, Rücken gerade halten und Hüfte oben, Oberarme und Ellbogen nah am Körper halten, in Ausgangsposition zurückdrücken',
            [ExDescType.EXECUTION]:
              '8-10 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]: 'Trizeps, Brustmuskel, Bauchmuskulatur',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Bauchpresse mit Erhöhung',
          description: {
            [ExDescType.DESCRIPTION]:
              'Ausgansposition auf dem Rücken liegend, Hände an die Schläfen, Beine und Füße bleiben unbewegt auf der Erhöhung, wenn man die Schultern nach oben hebt, unterer Rücken bleibt stabil auf dem Boden, Kopf in Verlängerung zur Wirbelsäule, für ein paar Sekunden halten, danach langsam zurücksinken in Ausgansposition',
            [ExDescType.EXECUTION]:
              '8-10 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]: 'gerader Bauchmuskel, seitliche Bauchmuskeln',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Bauchpresse',
          description: {
            [ExDescType.DESCRIPTION]:
              'Ausgansposition auf dem Rücken liegend, Hände an die Schläfen, Beine und Füße bleiben unbewegt auf dem Boden, wenn man die Schultern nach oben hebt, unterer Rücken bleibt stabil auf dem Boden, Kopf in Verlängerung zur Wirbelsäule, für ein paar Sekunden halten, danach langsam zurücksinken in Ausgansposition',
            [ExDescType.EXECUTION]:
              '8-10 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]: 'gerader Bauchmuskel, seitliche Bauchmuskeln',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Feuer, Wasser, Donner, Blitz!',
          description: {
            [ExDescType.DESCRIPTION]:
              'Die Kinder rennen herum bis eine erwachsene Person Feuer, Wasser oder Blitz schreit.\n\n\
                Feuer: sich ganz klein auf den Boden legen (Füße und Ellenbogen zusammen)\n\
                Wasser: sich in die Höhe begeben (z.B. auf eine Stange)\n\
                Donner: sich flach auf den Rücken legen\n\
                Blitz: in der Bewegung erstarren\n',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find((d) => d.difficulty === DifficultyType.GAME)
                ?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Katz und Maus',
          description: {
            [ExDescType.DESCRIPTION]:
              'Die Kinder sitzen bzw. stehen immer zu zweit zusammen an einem Platz. Ein Pärchen bildet die Katze und die Maus. Die Katze verfolgt die Maus.\n\n\
            Sobald die Maus gefangen wird, muss die Maus der Katze nachrennen. Sobald sich die Maus zu einem Pärchen dazu sitzt, muss die äußere Person der Katze nachrennen und ist so die neue Katze.',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find((d) => d.difficulty === DifficultyType.GAME)
                ?.id,
            },
          },
          video: 'not-yet-defined',
        },
      ],
    },
    {
      id: 3,
      name: 'Parkourpark Remise',
      address: 'Badgässele 2, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-2',
      gmaps: 'https://goo.gl/maps/7rtaEfM9dVew7KWm8',
      coordinates: {
        latitude: 47.50271455933779,
        longitude: 9.73657343480402,
      },
      exercises: [
        {
          name: 'Liegestütz an der Mauer',
          description: {
            [ExDescType.DESCRIPTION]:
              'Spanne deinen Rumpf an. Lass nun deinen Oberkörper langsam zur Erhöhung senken; die Hände bleiben dabei unter den Schultern und der Rumpf angespannt. Strecke die Arme, bis du wieder in der Ausgangsposition ankommst.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Liegestütz',
          description: {
            [ExDescType.DESCRIPTION]:
              'Spanne deinen Rumpf an. Lass nun deinen Oberkörper langsam zur Erhöhung senken; die Hände bleiben dabei unter den Schultern und der Rumpf angespannt. Strecke die Arme, bis du wieder in der Ausgangsposition ankommst.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Wadenheben am Barren',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stelle dich hüftbreit hin und halte dich mit den Armen am Barren fest. Beuge deine Knie leicht nach vorne und versuche den Rücken gerade zu halten. Die Bauchmuskeln müssen angespannt sein und die Fersen werden bis zum tiefsten Punkt gesenkt. Versuche nun die Fersen so hoch wie möglich zu heben. Beachte, dass nicht nur die Zehen abgestützt werden. Achte darauf, dass du dich nicht mit deinen Füßen abfederst.',
            [ExDescType.EXECUTION]:
              '6-10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Schollenmuskel, Zwillingswadenmuskel, Langer und kurzer Wadenbeinmuskel, Hinterer Schienbeinmuskel, Langer Zehenbeuger',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Einbeiniges Wadenheben am Barren',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stelle dich hüftbreit hin und halte dich mit den Armen am Barren fest. Ein Bein ist dabei in der Luft. Beuge das Knie leicht nach vorne und versuche den Rücken gerade zu halten. Die Bauchmuskeln müssen angespannt sein und die Ferse wird bis zum tiefsten Punkt gesenkt. Versuche nun die Ferse so hoch wie möglich zu heben. Beachte, dass nicht nur die Zehen abgestützt werden. Achte darauf, dass du dich nicht mit deinem Fuß abfederst.',
            [ExDescType.EXECUTION]:
              '6-10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause dazwischen\nWechsle nach jedem Satz das Bein!',
            [ExDescType.MUSCLES]:
              'Schollenmuskel, Zwillingswadenmuskel, Langer und kurzer Wadenbeinmuskel, Hinterer Schienbeinmuskel, Langer Zehenbeuger',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Plank',
          description: {
            [ExDescType.DESCRIPTION]:
              'Gehe auf die Knie und lege deine Unterarme auf dem Boden ab. Deine Ellenbogen befinden sich unter den Schultern. Dein Blick richtest du zum Boden. Anschließend heben deine Oberschenkel ab. Deine Füße sind zusammen, mit den Zehenspitzen auf dem Boden.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3 Sätzen\n30s Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Bauchmuskulatur, Beinmuskulatur, Armmuskulatur, Gesäßmuskulatur, Tiefe Rumpf- und Rückenmuskulatur',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Superman-Planks',
          description: {
            [ExDescType.DESCRIPTION]:
              'Beginne in der normalen Plank Position. Hebe einen Arm an, die Fingerspitzen zeigen nach vorne. Hebe nun ein Bein und drücke die Zehenspitzen nach hinten. Halte die Position 1-3 Sekunden. Wechsle die Seite und wiederhole die Übung.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3 Sätzen\n30s Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Bauchmuskulatur, Beinmuskulatur, Armmuskulatur, Gesäßmuskulatur, Tiefe Rumpf- und Rückenmuskulatur',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Squad Jumps',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stelle dich hüftbreit hin und richte deine Füße leicht nach außen. Der Schwerpunkt befindet sich auf den Fersen, wenn du deinen Po nach hinten schiebst und die Beine beugst. Dein Blick ist nach vorne gerichtet. Deine Hände berühren sich vor dem Körper und dein Rücken muss eine aufrechte Haltung haben. Der untere Rücken bildet ein Hohlkreuz. Jetzt befindest du dich in einer leichten Hocke, spannst deine Muskeln an und springst in die Luft. Strecke während dem Sprung deinen ganzen Körper. Die Arme streckst du mit voller Spannung nach unten. Nach deiner Landung führst du die Übung 10-mal aus.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'vierköpfiger Oberschenkelmuskel, Beinbizeps, Großer Gesäßmuskel, Rückenstrecker, Bauchmuskeln',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Squat Jumps auf die Mauer',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stelle dich hüftbreit hin und richte deine Füße leicht nach außen. Der Schwerpunkt befindet sich auf den Fersen, wenn du deinen Po nach hinten schiebst und die Beine beugst. Dein Blick ist nach vorne gerichtet. Deine Hände berühren sich vor dem Körper und dein Rücken muss eine aufrechte Haltung haben. Der untere Rücken bildet ein Hohlkreuz. Jetzt befindest du dich in einer leichten Hocke, spannst deine Muskeln an und springst in die Luft. Strecke während dem Sprung deinen ganzen Körper und springe auf die Mauer. Nach deiner Landung führst du die Übung 10 bis 15-mal aus.',
            [ExDescType.EXECUTION]:
              '10-15 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'vierköpfiger Oberschenkelmuskel, Beinbizeps, Großer Gesäßmuskel, Rückenstrecker, Bauchmuskeln',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Dips auf der Mauer',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stütze dich auf der Erhöhung ab Ellbogen zeigen nach hinten (nicht zur Seite) Ziehe deine Schulterblätter zusammen bzw. deine Schultern nach hinten Spanne deinen Po an und versuche Ihn leicht nach hinten/oben zu ziehen Versuche dich so weit wie möglich abzulassen. Drücke dich kontrolliert nach oben. Beim Runtergehen sind deine Beine angewinkelt.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3-4 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Trizeps, Knorrenmuskel, Vorderer Teil des Deltamuskels, Großer Brustmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Dips auf dem Barren',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stütze dich auf der Erhöhung ab Ellbogen zeigen nach hinten (nicht zur Seite) Ziehe deine Schulterblätter zusammen bzw. deine Schultern nach hinten Spanne deinen Po an und versuche Ihn leicht nach hinten/oben zu ziehen Versuche dich so weit wie möglich abzulassen. Drücke dich kontrolliert nach oben.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Trizeps, Knorrenmuskel, Vorderer Teil des Deltamuskels, Großer Brustmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'The Floor is Lava',
          description: {
            [ExDescType.DESCRIPTION]:
              'Die Kinder verteilen sich im Parkourpark und bewegen sich fort. Plötzlich ruft jemand „The Floor is Lava” und zählt bis fünf. Alle, die in der Nähe stehen, müssen jetzt auf sicheres Terrain klettern, um nicht zu „verbrennen“.',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find((d) => d.difficulty === DifficultyType.GAME)
                ?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Hochfangis',
          description: {
            [ExDescType.DESCRIPTION]:
              'Je nach Anzahl der Kinder werden jeweils 1-2 Fänger bestimmt. Die Fänger müssen die Kinder fangen, allerdings nur wenn sie auf dem Boden sind. Die Kinder können auf verschiedene Objekte gehen, die sich in der Höhe befinden. Allerdings nur für 10 Sekunden. Die Fänger müssen immer in Bewegung bleiben und dürfen nicht vor einem Objekt warten bis die 10 Sekunden um sind.',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find((d) => d.difficulty === DifficultyType.GAME)
                ?.id,
            },
          },
          video: 'not-yet-defined',
        },
      ],
    },
    {
      id: 4,
      name: 'Schulsportplatz MS Stadt',
      address: 'Schillerstraße 7, 6900 Bregenz',
      image: 'https://picsum.photos/400/200',
      qr: 'not-yet-defined-3',
      gmaps: 'https://goo.gl/maps/eBj3bP1BdhekjLzx9',
      coordinates: {
        latitude: 47.504987444727035,
        longitude: 9.751705840629597,
      },
      exercises: [
        {
          name: 'Trizeps-Dips mit einer Erhöhung',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stütze dich auf der Erhöhung ab. Ellbogen zeigen nach hinten (nicht zur Seite). Ziehe deine Schulterblätter zusammen bzw. deine Schultern nach hinten. Spanne deinen Po an und versuche Ihn leicht nach hinten/oben zu ziehen. Versuche dich soweit wie möglich abzulassen. Drücke dich kontrolliert nach oben',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3-4 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Trizeps, Knorrenmuskel, Vorderer Teil des Deltamuskels, Großer Brustmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Trizeps-Dips mit zwei Erhöhungen',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stütze dich auf den Erhöhungen ab. Ellbogen zeigen nach hinten (nicht zur Seite). Ziehe deine Schulterblätter zusammen bzw. deine Schultern nach hinten. Spanne deinen Po an und versuche Ihn leicht nach hinten/oben zu ziehen. Versuche dich soweit wie möglich abzulassen. Drücke dich kontrolliert nach oben',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3-4 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Trizeps, Knorrenmuskel, Vorderer Teil des Deltamuskels, Großer Brustmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Liegestütz mit angewinkelten Beinen und Erhöhung',
          description: {
            [ExDescType.DESCRIPTION]:
              'Spanne deinen Rumpf an. Lass nun deinen Oberkörper langsam zur Erhöhung senken; die Hände bleiben dabei unter den Schultern und der Rumpf angespannt. Strecke die Arme, bis du wieder in der Ausgangsposition ankommst.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Liegestütz mit gestreckten Beinen und Erhöhung',
          description: {
            [ExDescType.DESCRIPTION]:
              'Spanne deinen Rumpf an. Lass nun deinen Oberkörper langsam zur Erhöhung senken; die Hände bleiben dabei unter den Schultern und der Rumpf angespannt. Strecke die Arme, bis du wieder in der Ausgangsposition ankommst.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
            [ExDescType.MUSCLES]:
              'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Mountainclimber einbeinig',
          description: {
            [ExDescType.DESCRIPTION]:
              'Du gehst tief in eine Kniebeuge und platzierst deine Handflächen auf dem Boden. Dann springst du nach hinten in eine Plank-Position und machst einen Liegestütz. Anschließend springst du wieder nach vorne in die Kniebeuge und machst einen Strecksprung nach oben. Fertig!',
            [ExDescType.EXECUTION]: 'Langsam probieren!',
            [ExDescType.MUSCLES]:
              'Core-Muskulatur, Brustmuskeln, Trizeps, Beinmuskulatur, Gesäßmuskeln',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Mountainclimber beidbeinig',
          description: {
            [ExDescType.DESCRIPTION]:
              'Der Rücken ist in einer geraden Position. Nun werden die Knie abwechselnd Richtung Brustkorb gezogen. Das hintere Bein bleibt gerade gestreckt. Entscheidend bei der Ausführung des Bergsteigers ist, dass Du Deine Körperspannung durchgehend beibehältst.',
            [ExDescType.EXECUTION]: 'Schnell probieren!',
            [ExDescType.MUSCLES]:
              'Beine, Lenden-Darmbeinmuskel, Bauchmuskeln, unterer Rücken, Brustmuskeln, Arme, Stabilisation der Wirbelsäule',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Jump-Ups auf Steinbank einbeinig',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stelle dich hüftbreit vor die Steinmauer und gib deine Hände anstelle deiner Hüften. Stelle dich dann langsam auf die Steinmauer und achte darauf, dass du nicht zurückkippst. Danach gehst du mit dem anderen Bein wieder auf den Boden und wiederholst diesen Vorgang.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 2 Sätzen\n30-45s Pause zwischen den Sätzen',
            [ExDescType.MUSCLES]:
              'hinterer Oberschenkelmuskel, Quadrizeps, Wadenmuskel, Gesäßmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Jump-Ups auf Steinbank beidbeinig',
          description: {
            [ExDescType.DESCRIPTION]:
              'Stelle dich hüftbreit vor die Steinmauer und strecke die Hände gerade nach vorne aus. Springe dann beidbeinig auf die Steinmauer und achte darauf, dass du nicht zurückkippst. Danach springst du beidbeinig wieder auf den Boden und wiederholst diesen Vorgang.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 2 Sätzen\n30-45s Pause zwischen den Sätzen',
            [ExDescType.MUSCLES]:
              'hinterer Oberschenkelmuskel, Quadrizeps, Wadenmuskel, Gesäßmuskel',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Kniebäuge auf dem Boden',
          description: {
            [ExDescType.DESCRIPTION]:
              'Deine ganzen Fußsohlen müssen durchgehend auf dem Boden sein. Bewege deine Füße langsam vorwärts und senke deinen Oberkörper parallel zur Wand hinunter. Deine Knie sollten beim Absenken gebeugt sein.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause zwischen den Sätzen',
            [ExDescType.MUSCLES]:
              'vordere Beinmuskulatur, Gesäßmuskulatur, Beinbizeps',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.BEGINNER
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Kniebeuge auf der Kletterwand',
          description: {
            [ExDescType.DESCRIPTION]:
              'Deine ganzen Fußsohlen müssen durchgehend auf den Klettergriffensein. Bewege deine Füße langsam vorwärts und senke deinen Oberkörper parallel zur Wand hinunter. Deine Knie sollten beim Absenken gebeugt sein.',
            [ExDescType.EXECUTION]:
              '10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause zwischen den Sätzen',
            [ExDescType.MUSCLES]:
              'vordere Beinmuskulatur, Gesäßmuskulatur, Beinbizeps',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find(
                (d) => d.difficulty === DifficultyType.ADVANCED
              )?.id,
            },
          },
          video: 'not-yet-defined',
        },
        {
          name: 'Piratenfängi',
          description: {
            [ExDescType.DESCRIPTION]:
              'Es werden je nach Anzahl der Kinder 1-2 Fänger bestimmt. Am Spielplatz gibt es verschiedene Hindernisse, auf denen man gehen oder hinaufklettern kann. Wichtig ist, dass man nie auf den Betonboden steht.\n\n\
              Die Piraten bekommen ca. 30 Sekunden Vorsprung, um sich zu verstecken bzw. auf dem Platz zu verteilen. Nach den 30 Sekunden beginnen die Fänger die Piraten zu fangen. Jeder gefangene Pirat muss sich auf die Seite stellen und 10 Hampelmänner machen. Ist dies erledigt, darf er wieder mitspielen. Die Hampelmänner müssen auch gemacht werden, wenn ein Pirat auf den Betonboden steht. Steht ein Fänger auf den Boden, so ist das Spiel vorbei.',
          },
          coins: 10,
          difficulty: {
            connect: {
              id: difficulties.find((d) => d.difficulty === DifficultyType.GAME)
                ?.id,
            },
          },
          video: 'not-yet-defined',
        },
      ],
    },
  ];

  await Promise.all(
    parks.map(async (park) => {
      const { coordinates, exercises, ...parkOnly } = park;
      await prisma.park.create({
        data: {
          ...parkOnly,
          coordinates: {
            create: coordinates,
          },
          exercises: {
            create: exercises,
          },
        },
      });
    })
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

const main = async () => {
  await purgeDatabase();
  await createDifficulties();
  await createParks();
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
