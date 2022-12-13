import { NotificationType } from '../enums';

export type Notification = {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
};
