import { Coordinates } from './coordinates';
import { Exercise } from './exercise';

export type Park = {
  id: number;
  qr: string;
  name: string;
  address: string;
  image: string;
  gmaps?: string | undefined;
  exercises?: Exercise[];
  coordinates?: Coordinates;
};
