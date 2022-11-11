import { Exercise, User } from '..';

export type Activity = {
  id: string;
  startedAt: Date;
  endedAt: Date;
  exercise: Exercise;
  user: User;
};
