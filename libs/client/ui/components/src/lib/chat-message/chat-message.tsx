import { Message } from '@bregenz-bewegt/client/types';
import { IonCardSubtitle, IonItem, IonLabel, IonRow } from '@ionic/react';
import React from 'react';
import './chat-message.scss';

export interface ChatMessageProps {
  message: Omit<Message, 'conversation'> & {
    selfSent: boolean;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  console.log(message);
  return (
    <IonItem key={message.id} className="chat-message">
      <IonCardSubtitle>{message.author.username}</IonCardSubtitle>
      <IonLabel>{message.text}</IonLabel>
    </IonItem>
  );
};
