import { Message } from '@bregenz-bewegt/client/types';
import { IonCardSubtitle, IonLabel, IonRow } from '@ionic/react';
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
    <IonRow
      key={message.id}
      className={`chat-message${
        message.selfSent ? ' chat-message__self-sent' : ''
      }`}
    >
      <div className="chat-message__author">{message.author.username}</div>
      <div className="chat-message__text">{message.text}</div>
    </IonRow>
  );
};
