import * as yup from 'yup';

yup.setLocale({
  mixed: {
    default: 'Feld ungültig',
    required: 'Feld benötigt',
    oneOf: 'Eingabe einem der folgenden Werte entsprechen: ${values}',
    notOneOf: 'Eingabe darf keinem der folgenden Werte entsprechen: ${values}',
  },
  string: {
    length: 'Eingabe muss genau ${length} Zeichen lang sein',
    min: 'Eingabe muss mindestens ${min} Zeichen lang sein',
    max: 'Eingabe darf höchstens ${max} Zeichen lang sein',
    matches: 'Eingabe muss wie folgt aussehen: "${regex}"',
    email: 'Feld muss eine gültige E-Mail Adresse sein',
    url: 'Eingabe muss eine gültige URL sein',
    trim: 'Eingabe darf keine Leerzeichen am Anfang oder Ende enthalten',
    lowercase: 'Eingabe darf nur Kleinschreibung enthalten',
    uppercase: 'Eingabe darf nur Großschreibung enthalten',
  },
  number: {
    min: 'Eingabe muss größer oder gleich ${min} sein',
    max: 'Eingabe muss kleiner oder gleich ${max} sein',
    lessThan: 'Eingabe muss kleiner sein als ${less}',
    moreThan: 'Eingabe muss größer sein als ${more}',
    positive: 'Eingabe muss eine positive Zahl sein',
    negative: 'Eingabe muss eine negative Zahl sein',
    integer: 'Eingabe muss eine ganze Zahl sein',
  },
  date: {
    min: 'Datum muss später sein als ${min}',
    max: 'Datum muss früher sein als ${max}',
  },
  array: {
    min: 'Feld muss mindesten ${min} Einträge haben',
    max: 'Feld darf höchstens ${max} Einträge haben',
  },
});
