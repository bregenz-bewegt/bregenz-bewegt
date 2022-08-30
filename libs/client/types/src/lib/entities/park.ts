import { Exercise } from './exercise';

export type Park = {
  id: number;
  qr: string;
  name: string;
  address: string;
  image: string;
  exercises?: Exercise[];
};
