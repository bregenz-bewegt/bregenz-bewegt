import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient, DifficultyType } from '@prisma/client';
const prisma = new PrismaClient();

const updateParks = async () => {
  const parks = [
    {
      id: 1,
      name: 'Generationen Park Mariahilf',
      address: 'Mariahilfstraße 50, 6900 Bregenz',
      image: 'parks/images/generationen-park-mariahilf.png',
      qr: 'not-yet-defined-0',
      gmaps: 'https://goo.gl/maps/R5LVWh3DZD27ViwXA',
      coordinates: {
        latitude: 47.49504770373178,
        longitude: 9.728410353659996,
      },
      exercises: [
        {
          id: 1,
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
          id: 2,
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
          id: 3,
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
          id: 4,
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
          id: 5,
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
          id: 6,
          name: 'Burpee',
          description:
            'Du gehst tief in eine Kniebeuge und platzierst deine Handflächen auf dem Boden. Dann springst du nach hinten in eine Plank-Position und machst einen Liegestütz. Anschließend springst du wieder nach vorne in die Kniebeuge und machst einen Strecksprung nach oben. Fertig!',
          execution:
            'So oft wie möglich in 1 Minute!\n(30-40 = Spitzenleistung)',
          muscles:
            'Core-Muskulatur, Brustmuskeln, Trizeps, Beinmuskulatur, Gesäßmuskeln',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 7,
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
          id: 8,
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
          id: 9,
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
          id: 10,
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
          id: 11,
          name: 'Ochs am Berg',
          description:
            'Es wird ein Ochs bestimmt, welcher sich an einem Baum oder einer Wand positioniert. Die restlichen Schüler stellen sich mindestens 10 Meter vom Ochs entfernt auf.\n\n\
              Der Ochs wendet sein Gesicht von der Gruppe ab, zählt bis drei und ruft: “Eins, zwei, drei, Ochs am Berg!” Danach dreht er sich um. Solange der Ochs ruft, rennen die restlichen Spieler auf den Ochs zu. Beim Wort Berg müssen die Schüler stehen bleiben und dürfen sich nicht mehr bewegen. Wird ein Schüler in der Bewegung erwischt, muss dieser wieder zurück an den Anfang.',
          coins: 10,
          difficulty: DifficultyType.GAME,
          video: 'not-yet-defined',
        },
      ],
    },
    {
      id: 2,
      name: 'Jugendplatz Spielfeld 3',
      address: 'Achsiedlungsstraße 93, 6900 Bregenz',
      image: 'parks/images/jugendplatz-spielfeld.png',
      qr: 'not-yet-defined-1',
      gmaps: 'https://goo.gl/maps/rRa2EQv8ZBmp7Du86',
      coordinates: {
        latitude: 47.498879742248256,
        longitude: 9.7036399397155,
      },
      exercises: [
        {
          id: 12,
          name: 'Hängen lassen (Ringe)',
          description:
            'Greift die 2 Ringe im Oberhandgriff (Finger vom Körper weg), Arme strecken, Körper ruhig hängen lassen (nicht Schwingen), Knie im rechten Winkel beugen',
          execution: '30 Sek jeweils 3 Sätze\n1 Minute Pause dazwischen',
          muscles:
            'oberer Rücken, Schultern, Ader, Unterarme, Hand- und Handgelenksbeuger',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 13,
          name: 'Hangeln (Stange)',
          description:
            'Greift die Stange im Oberhandgriff (Finger vom Körper weg), Arme strecken, Knie im rechten Winkel beugen, eine Stange nach der anderen greifen',
          execution: '3 Runden\n1 Minute Pause dazwischen',
          muscles:
            'oberer Rücken, Schultern, Bizeps, Unterarme, Hand- und Handgelenksbeuger',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 14,
          name: 'Supermann ausgestreckte Arme',
          description:
            'Bauchlage, Beine fast durchstrecken, Arme ausstrecken, Spannung aufbauen, gleichzeitig Arme und Beine bis zum Becken heben, hebe Kopf und Oberkörper ein kleines Stück vom Boden ab, Position kurzhalten, Arme; Beine; Kopf; Oberkörper wieder entspannt auf Boden legen',
          execution:
            '15 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
          muscles: 'Rückenstrecker, Gesäßmuskel, Beinbizeps',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 15,
          name: 'Supermann angezogene Arme',
          description:
            'Bauchlage, Beine fast durchstrecken, Spannung aufbauen, gleichzeitig Arme und Beine bis zum Becken, hebe Kopf und Oberkörper ein kleines Stück vom Boden ab, Ellbogen ziehen nach hinten zum Rücken (Schulterblätter zusammen), Position kurzhalten, Arme; Beine; Kopf; Oberkörper wieder entspannt auf Boden legen',
          execution:
            '15 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
          muscles: 'Rückenstrecker, Gesäßmuskel, Beinbizeps',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 16,
          name: 'Arm-/Beinheben im Vierfüßlerstand',
          description:
            'Ausgansposition Vierfüßlerstand -> Kopf verlängert Wirbelsäule, Bauch und Beckenboden anspannen, rechten Arm vom Boden abheben und ihn in Verlängerung des Oberkörpers weit nach vorne ausstrecken, linkes Bein anheben und in Verlängerung zum Rumpf gerade nach hinten ausstrecken, in Ausgansposition zurückkommen und Arm/Bein wechseln',
          execution:
            '15 Wiederholungen pro Bein jeweils 3 Sätze\n1 Minute Pause dazwischen',
          muscles:
            'Rumpfmuskulatur, Rückenmuskulatur, Gesäßmuskulatur, Beinmuskulatur',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 17,
          name: 'Arm-/Beinheben in Liegestützposition',
          description:
            'Ausgansposition Liegestützposition, Beine vollständig durchstrecken, Po Richtung Himmel, Rumpf anspannen, Bein vom Boden abheben und Bein parallel zum Boden ausrichten, Position für einige Sekunden halten und Bein wieder abstellen',
          execution:
            '15 Wiederholungen pro Bein jeweils 3 Sätze\n1 Minute Pause dazwischen',
          muscles:
            'Rumpfmuskulatur, Rückenmuskulatur, Gesäßmuskulatur, Beinmuskulatur',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 18,
          name: 'Trizepsstrecken am Boden',
          description:
            'Ausgansposition Unterarmstütz, Unterarme liegen auf dem Boden und Beine sind gestreckt, Arme komplett durchstrecken, langsam und kontrolliert in Ausgansposition zurück',
          execution:
            '8-10 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
          muscles: 'Trizeps, Brustmuskel, Bauchmuskulatur',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 19,
          name: 'Diamant-Liegestütz',
          description:
            'Ausgansposition Liegestützposition, mit den Händen ein Diamant formen bzw. Dreieck, Rumpfmuskulatur anspannen und Arme leicht nach unten beugen, Rücken gerade halten und Hüfte oben, Oberarme und Ellbogen nah am Körper halten, in Ausgangsposition zurückdrücken',
          execution:
            '8-10 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
          muscles: 'Trizeps, Brustmuskel, Bauchmuskulatur',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 20,
          name: 'Bauchpresse mit Erhöhung',
          description:
            'Ausgansposition auf dem Rücken liegend, Hände an die Schläfen, Beine und Füße bleiben unbewegt auf der Erhöhung, wenn man die Schultern nach oben hebt, unterer Rücken bleibt stabil auf dem Boden, Kopf in Verlängerung zur Wirbelsäule, für ein paar Sekunden halten, danach langsam zurücksinken in Ausgansposition',
          execution:
            '8-10 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
          muscles: 'gerader Bauchmuskel, seitliche Bauchmuskeln',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 21,
          name: 'Bauchpresse',
          description:
            'Ausgansposition auf dem Rücken liegend, Hände an die Schläfen, Beine und Füße bleiben unbewegt auf dem Boden, wenn man die Schultern nach oben hebt, unterer Rücken bleibt stabil auf dem Boden, Kopf in Verlängerung zur Wirbelsäule, für ein paar Sekunden halten, danach langsam zurücksinken in Ausgansposition',
          execution:
            '8-10 Wiederholungen jeweils 3 Sätze\n1 Minute Pause dazwischen',
          muscles: 'gerader Bauchmuskel, seitliche Bauchmuskeln',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 22,
          name: 'Feuer, Wasser, Donner, Blitz!',
          description:
            'Die Kinder rennen herum bis eine erwachsene Person Feuer, Wasser oder Blitz schreit.\n\n\
                Feuer: sich ganz klein auf den Boden legen (Füße und Ellenbogen zusammen)\n\
                Wasser: sich in die Höhe begeben (z.B. auf eine Stange)\n\
                Donner: sich flach auf den Rücken legen\n\
                Blitz: in der Bewegung erstarren\n',
          coins: 10,
          difficulty: DifficultyType.GAME,
          video: 'not-yet-defined',
        },
        {
          id: 23,
          name: 'Katz und Maus',
          description:
            'Die Kinder sitzen bzw. stehen immer zu zweit zusammen an einem Platz. Ein Pärchen bildet die Katze und die Maus. Die Katze verfolgt die Maus.\n\n\
            Sobald die Maus gefangen wird, muss die Maus der Katze nachrennen. Sobald sich die Maus zu einem Pärchen dazu sitzt, muss die äußere Person der Katze nachrennen und ist so die neue Katze.',
          coins: 10,
          difficulty: DifficultyType.GAME,
          video: 'not-yet-defined',
        },
      ],
    },
    {
      id: 3,
      name: 'Parkourpark Remise',
      address: 'Badgässele 2, 6900 Bregenz',
      image: 'parks/images/parkourpark-remise.png',
      qr: 'not-yet-defined-2',
      gmaps: 'https://goo.gl/maps/7rtaEfM9dVew7KWm8',
      coordinates: {
        latitude: 47.50271455933779,
        longitude: 9.73657343480402,
      },
      exercises: [
        {
          id: 24,
          name: 'Liegestütz an der Mauer',
          description:
            'Spanne deinen Rumpf an. Lass nun deinen Oberkörper langsam zur Erhöhung senken; die Hände bleiben dabei unter den Schultern und der Rumpf angespannt. Strecke die Arme, bis du wieder in der Ausgangsposition ankommst.',
          execution:
            '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
          muscles: 'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 25,
          name: 'Liegestütz',
          description:
            'Spanne deinen Rumpf an. Lass nun deinen Oberkörper langsam zur Erhöhung senken; die Hände bleiben dabei unter den Schultern und der Rumpf angespannt. Strecke die Arme, bis du wieder in der Ausgangsposition ankommst.',
          execution:
            '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
          muscles: 'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 26,
          name: 'Wadenheben am Barren',
          description:
            'Stelle dich hüftbreit hin und halte dich mit den Armen am Barren fest. Beuge deine Knie leicht nach vorne und versuche den Rücken gerade zu halten. Die Bauchmuskeln müssen angespannt sein und die Fersen werden bis zum tiefsten Punkt gesenkt. Versuche nun die Fersen so hoch wie möglich zu heben. Beachte, dass nicht nur die Zehen abgestützt werden. Achte darauf, dass du dich nicht mit deinen Füßen abfederst.',
          execution:
            '6-10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause dazwischen',
          muscles:
            'Schollenmuskel, Zwillingswadenmuskel, Langer und kurzer Wadenbeinmuskel, Hinterer Schienbeinmuskel, Langer Zehenbeuger',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 27,
          name: 'Einbeiniges Wadenheben am Barren',
          description:
            'Stelle dich hüftbreit hin und halte dich mit den Armen am Barren fest. Ein Bein ist dabei in der Luft. Beuge das Knie leicht nach vorne und versuche den Rücken gerade zu halten. Die Bauchmuskeln müssen angespannt sein und die Ferse wird bis zum tiefsten Punkt gesenkt. Versuche nun die Ferse so hoch wie möglich zu heben. Beachte, dass nicht nur die Zehen abgestützt werden. Achte darauf, dass du dich nicht mit deinem Fuß abfederst.',
          execution:
            '6-10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause dazwischen\nWechsle nach jedem Satz das Bein!',
          muscles:
            'Schollenmuskel, Zwillingswadenmuskel, Langer und kurzer Wadenbeinmuskel, Hinterer Schienbeinmuskel, Langer Zehenbeuger',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 28,
          name: 'Plank',
          description:
            'Gehe auf die Knie und lege deine Unterarme auf dem Boden ab. Deine Ellenbogen befinden sich unter den Schultern. Dein Blick richtest du zum Boden. Anschließend heben deine Oberschenkel ab. Deine Füße sind zusammen, mit den Zehenspitzen auf dem Boden.',
          execution:
            '10 Wiederholungen mit jeweils 3 Sätzen\n30s Pause dazwischen',
          muscles:
            'Bauchmuskulatur, Beinmuskulatur, Armmuskulatur, Gesäßmuskulatur, Tiefe Rumpf- und Rückenmuskulatur',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 29,
          name: 'Superman-Planks',
          description:
            'Beginne in der normalen Plank Position. Hebe einen Arm an, die Fingerspitzen zeigen nach vorne. Hebe nun ein Bein und drücke die Zehenspitzen nach hinten. Halte die Position 1-3 Sekunden. Wechsle die Seite und wiederhole die Übung.',
          execution:
            '10 Wiederholungen mit jeweils 3 Sätzen\n30s Pause dazwischen',
          muscles:
            'Bauchmuskulatur, Beinmuskulatur, Armmuskulatur, Gesäßmuskulatur, Tiefe Rumpf- und Rückenmuskulatur',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 30,
          name: 'Squad Jumps',
          description:
            'Stelle dich hüftbreit hin und richte deine Füße leicht nach außen. Der Schwerpunkt befindet sich auf den Fersen, wenn du deinen Po nach hinten schiebst und die Beine beugst. Dein Blick ist nach vorne gerichtet. Deine Hände berühren sich vor dem Körper und dein Rücken muss eine aufrechte Haltung haben. Der untere Rücken bildet ein Hohlkreuz. Jetzt befindest du dich in einer leichten Hocke, spannst deine Muskeln an und springst in die Luft. Strecke während dem Sprung deinen ganzen Körper. Die Arme streckst du mit voller Spannung nach unten. Nach deiner Landung führst du die Übung 10-mal aus.',
          execution:
            '10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause dazwischen',
          muscles:
            'vierköpfiger Oberschenkelmuskel, Beinbizeps, Großer Gesäßmuskel, Rückenstrecker, Bauchmuskeln',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 31,
          name: 'Squat Jumps auf die Mauer',
          description:
            'Stelle dich hüftbreit hin und richte deine Füße leicht nach außen. Der Schwerpunkt befindet sich auf den Fersen, wenn du deinen Po nach hinten schiebst und die Beine beugst. Dein Blick ist nach vorne gerichtet. Deine Hände berühren sich vor dem Körper und dein Rücken muss eine aufrechte Haltung haben. Der untere Rücken bildet ein Hohlkreuz. Jetzt befindest du dich in einer leichten Hocke, spannst deine Muskeln an und springst in die Luft. Strecke während dem Sprung deinen ganzen Körper und springe auf die Mauer. Nach deiner Landung führst du die Übung 10 bis 15-mal aus.',
          execution:
            '10-15 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause dazwischen',
          muscles:
            'vierköpfiger Oberschenkelmuskel, Beinbizeps, Großer Gesäßmuskel, Rückenstrecker, Bauchmuskeln',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 32,
          name: 'Dips auf der Mauer',
          description:
            'Stütze dich auf der Erhöhung ab Ellbogen zeigen nach hinten (nicht zur Seite) Ziehe deine Schulterblätter zusammen bzw. deine Schultern nach hinten Spanne deinen Po an und versuche Ihn leicht nach hinten/oben zu ziehen Versuche dich so weit wie möglich abzulassen. Drücke dich kontrolliert nach oben. Beim Runtergehen sind deine Beine angewinkelt.',
          execution:
            '10 Wiederholungen mit jeweils 3-4 Sätzen\n1 Minute Pause dazwischen',
          muscles:
            'Trizeps, Knorrenmuskel, Vorderer Teil des Deltamuskels, Großer Brustmuskel',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 33,
          name: 'Dips auf dem Barren',
          description:
            'Stütze dich auf der Erhöhung ab Ellbogen zeigen nach hinten (nicht zur Seite) Ziehe deine Schulterblätter zusammen bzw. deine Schultern nach hinten Spanne deinen Po an und versuche Ihn leicht nach hinten/oben zu ziehen Versuche dich so weit wie möglich abzulassen. Drücke dich kontrolliert nach oben.',
          execution:
            '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
          muscles:
            'Trizeps, Knorrenmuskel, Vorderer Teil des Deltamuskels, Großer Brustmuskel',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 34,
          name: 'The Floor is Lava',
          description:
            'Die Kinder verteilen sich im Parkourpark und bewegen sich fort. Plötzlich ruft jemand „The Floor is Lava” und zählt bis fünf. Alle, die in der Nähe stehen, müssen jetzt auf sicheres Terrain klettern, um nicht zu „verbrennen“.',
          coins: 10,
          difficulty: DifficultyType.GAME,
          video: 'not-yet-defined',
        },
        {
          id: 35,
          name: 'Hochfangis',
          description:
            'Je nach Anzahl der Kinder werden jeweils 1-2 Fänger bestimmt. Die Fänger müssen die Kinder fangen, allerdings nur wenn sie auf dem Boden sind. Die Kinder können auf verschiedene Objekte gehen, die sich in der Höhe befinden. Allerdings nur für 10 Sekunden. Die Fänger müssen immer in Bewegung bleiben und dürfen nicht vor einem Objekt warten bis die 10 Sekunden um sind.',
          coins: 10,
          difficulty: DifficultyType.GAME,
          video: 'not-yet-defined',
        },
      ],
    },
    {
      id: 4,
      name: 'Schulsportplatz MS Stadt',
      address: 'Schillerstraße 7, 6900 Bregenz',
      image: 'parks/images/schulsportplatz-ms-stadt.png',
      qr: 'not-yet-defined-3',
      gmaps: 'https://goo.gl/maps/eBj3bP1BdhekjLzx9',
      coordinates: {
        latitude: 47.504987444727035,
        longitude: 9.751705840629597,
      },
      exercises: [
        {
          id: 36,
          name: 'Trizeps-Dips mit einer Erhöhung',
          description:
            'Stütze dich auf der Erhöhung ab. Ellbogen zeigen nach hinten (nicht zur Seite). Ziehe deine Schulterblätter zusammen bzw. deine Schultern nach hinten. Spanne deinen Po an und versuche Ihn leicht nach hinten/oben zu ziehen. Versuche dich soweit wie möglich abzulassen. Drücke dich kontrolliert nach oben',
          execution:
            '10 Wiederholungen mit jeweils 3-4 Sätzen\n1 Minute Pause dazwischen',
          muscles:
            'Trizeps, Knorrenmuskel, Vorderer Teil des Deltamuskels, Großer Brustmuskel',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 37,
          name: 'Trizeps-Dips mit zwei Erhöhungen',
          description:
            'Stütze dich auf den Erhöhungen ab. Ellbogen zeigen nach hinten (nicht zur Seite). Ziehe deine Schulterblätter zusammen bzw. deine Schultern nach hinten. Spanne deinen Po an und versuche Ihn leicht nach hinten/oben zu ziehen. Versuche dich soweit wie möglich abzulassen. Drücke dich kontrolliert nach oben',
          execution:
            '10 Wiederholungen mit jeweils 3-4 Sätzen\n1 Minute Pause dazwischen',
          muscles:
            'Trizeps, Knorrenmuskel, Vorderer Teil des Deltamuskels, Großer Brustmuskel',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 38,
          name: 'Liegestütz mit angewinkelten Beinen und Erhöhung',
          description:
            'Spanne deinen Rumpf an. Lass nun deinen Oberkörper langsam zur Erhöhung senken; die Hände bleiben dabei unter den Schultern und der Rumpf angespannt. Strecke die Arme, bis du wieder in der Ausgangsposition ankommst.',
          execution:
            '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
          muscles: 'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 39,
          name: 'Liegestütz mit gestreckten Beinen und Erhöhung',
          description:
            'Spanne deinen Rumpf an. Lass nun deinen Oberkörper langsam zur Erhöhung senken; die Hände bleiben dabei unter den Schultern und der Rumpf angespannt. Strecke die Arme, bis du wieder in der Ausgangsposition ankommst.',
          execution:
            '10 Wiederholungen mit jeweils 3 Sätzen\n1 Minute Pause dazwischen',
          muscles: 'Großer Brustmuskel, Armstrecker, Vorderer Schultermuskel',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 40,
          name: 'Mountainclimber einbeinig',
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
          id: 41,
          name: 'Mountainclimber beidbeinig',
          description:
            'Der Rücken ist in einer geraden Position. Nun werden die Knie abwechselnd Richtung Brustkorb gezogen. Das hintere Bein bleibt gerade gestreckt. Entscheidend bei der Ausführung des Bergsteigers ist, dass Du Deine Körperspannung durchgehend beibehältst.',
          execution: 'Schnell probieren!',
          muscles:
            'Beine, Lenden-Darmbeinmuskel, Bauchmuskeln, unterer Rücken, Brustmuskeln, Arme, Stabilisation der Wirbelsäule',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 42,
          name: 'Jump-Ups auf Steinbank einbeinig',
          description:
            'Stelle dich hüftbreit vor die Steinmauer und gib deine Hände anstelle deiner Hüften. Stelle dich dann langsam auf die Steinmauer und achte darauf, dass du nicht zurückkippst. Danach gehst du mit dem anderen Bein wieder auf den Boden und wiederholst diesen Vorgang.',
          execution:
            '10 Wiederholungen mit jeweils 2 Sätzen\n30-45s Pause zwischen den Sätzen',
          muscles:
            'hinterer Oberschenkelmuskel, Quadrizeps, Wadenmuskel, Gesäßmuskel',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 43,
          name: 'Jump-Ups auf Steinbank beidbeinig',
          description:
            'Stelle dich hüftbreit vor die Steinmauer und strecke die Hände gerade nach vorne aus. Springe dann beidbeinig auf die Steinmauer und achte darauf, dass du nicht zurückkippst. Danach springst du beidbeinig wieder auf den Boden und wiederholst diesen Vorgang.',
          execution:
            '10 Wiederholungen mit jeweils 2 Sätzen\n30-45s Pause zwischen den Sätzen',
          muscles:
            'hinterer Oberschenkelmuskel, Quadrizeps, Wadenmuskel, Gesäßmuskel',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 44,
          name: 'Kniebäuge auf dem Boden',
          description:
            'Deine ganzen Fußsohlen müssen durchgehend auf dem Boden sein. Bewege deine Füße langsam vorwärts und senke deinen Oberkörper parallel zur Wand hinunter. Deine Knie sollten beim Absenken gebeugt sein.',
          execution:
            '10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause zwischen den Sätzen',
          muscles: 'vordere Beinmuskulatur, Gesäßmuskulatur, Beinbizeps',
          coins: 10,
          difficulty: DifficultyType.BEGINNER,
          video: 'not-yet-defined',
        },
        {
          id: 45,
          name: 'Kniebeuge auf der Kletterwand',
          description:
            'Deine ganzen Fußsohlen müssen durchgehend auf den Klettergriffensein. Bewege deine Füße langsam vorwärts und senke deinen Oberkörper parallel zur Wand hinunter. Deine Knie sollten beim Absenken gebeugt sein.',
          execution:
            '10 Wiederholungen mit jeweils 2 Sätzen\n1 Minute Pause zwischen den Sätzen',
          muscles: 'vordere Beinmuskulatur, Gesäßmuskulatur, Beinbizeps',
          coins: 10,
          difficulty: DifficultyType.ADVANCED,
          video: 'not-yet-defined',
        },
        {
          id: 46,
          name: 'Piratenfängi',
          description:
            'Es werden je nach Anzahl der Kinder 1-2 Fänger bestimmt. Am Spielplatz gibt es verschiedene Hindernisse, auf denen man gehen oder hinaufklettern kann. Wichtig ist, dass man nie auf den Betonboden steht.\n\n\
              Die Piraten bekommen ca. 30 Sekunden Vorsprung, um sich zu verstecken bzw. auf dem Platz zu verteilen. Nach den 30 Sekunden beginnen die Fänger die Piraten zu fangen. Jeder gefangene Pirat muss sich auf die Seite stellen und 10 Hampelmänner machen. Ist dies erledigt, darf er wieder mitspielen. Die Hampelmänner müssen auch gemacht werden, wenn ein Pirat auf den Betonboden steht. Steht ein Fänger auf den Boden, so ist das Spiel vorbei.',
          coins: 10,
          difficulty: DifficultyType.GAME,
          video: 'not-yet-defined',
        },
      ],
    },
  ];
  const difficulties = await prisma.difficulty.findMany();

  await Promise.all(
    parks.map(async (park) => {
      const { coordinates, exercises, id: parkId, ...parkOnly } = park;

      await prisma.park.upsert({
        where: {
          id: parkId,
        },
        update: parkOnly,
        create: {
          id: parkId,
          ...parkOnly,
        },
      });

      await prisma.coordinates.upsert({
        where: {
          id: parkId,
        },
        update: coordinates,
        create: {
          id: parkId,
          ...coordinates,
        },
      });

      await Promise.all(
        exercises.map(async (e) => {
          const { id: exerId, difficulty, ...onlyExer } = e;
          const diffId = difficulties.find(
            (d) => d.difficulty === difficulty
          )?.id;
          await prisma.exercise.upsert({
            where: {
              id: exerId,
            },
            update: {
              ...onlyExer,
            },
            create: {
              id: exerId,
              ...onlyExer,
            },
          });

          await prisma.exercise.update({
            where: {
              id: exerId,
            },
            data: {
              difficulty: { connect: { id: diffId } },
            },
          });
        })
      );

      await prisma.park.update({
        where: {
          id: parkId,
        },
        data: {
          coordinates: { connect: { id: parkId } },
          exercises: { connect: exercises.map((e) => ({ id: e.id })) },
        },
      });
    })
  );
};

const updateDifficulties = async () => {
  await Promise.all(
    Object.values(DifficultyType).map(
      async (difficulty, i) =>
        await prisma.difficulty.upsert({
          where: {
            id: i + 1,
          },
          update: { difficulty: difficulty },
          create: {
            id: i + 1,
            difficulty: difficulty,
          },
        })
    )
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
  await updateDifficulties();
  await updateParks();
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
