import { IonText } from '@ionic/react';
import React from 'react';
import './chat-date-divider.scss';

export interface ChatDateDividerProps {
  currentDate: Date;
  previousDate?: Date;
}

export const ChatDateDivider: React.FC<ChatDateDividerProps> = ({
  currentDate,
  previousDate,
}) => {
  const isSameDay = (d1: Date, d2?: Date) => {
    console.log(d1, d2);
    if (!d2) return false;

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return !isSameDay(currentDate, previousDate) ? (
    <div>
      <IonText color="light">{currentDate.toLocaleDateString()}</IonText>
    </div>
  ) : null;
};
