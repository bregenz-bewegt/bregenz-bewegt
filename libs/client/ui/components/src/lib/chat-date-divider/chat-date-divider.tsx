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
    if (!d2) return false;

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return !isSameDay(currentDate, previousDate) ? (
    <div className="chat-date-divider">
      <IonText color="medium">{currentDate.toLocaleDateString()}</IonText>
    </div>
  ) : null;
};
