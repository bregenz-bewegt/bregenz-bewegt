import { IonText } from '@ionic/react';
import React from 'react';
import './chat-date-divider.scss';

export interface ChatDateDividerProps {
  date: Date;
}

export const ChatDateDivider: React.FC<ChatDateDividerProps> = ({ date }) => {
  return (
    <div className="chat-date-divider">
      <IonText color="medium">{date.toLocaleDateString()}</IonText>
    </div>
  );
};
