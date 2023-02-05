import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { Message } from '@bregenz-bewegt/client/types';
import { IonAvatar, IonRow } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import './chat-message.scss';

export interface ChatMessageProps {
  message: Omit<Message, 'conversation'> & {
    selfSent: boolean;
  };
  userStore?: UserStore;
}

export const ChatMessage: React.FC<ChatMessageProps> = inject(
  userStore.storeKey
)(
  observer(({ message, userStore }) => {
    return (
      <IonRow
        key={message.id}
        className={`chat-message${
          message.selfSent ? ' chat-message--self-sent' : ''
        }`}
      >
        <Link to={`/user/${message.author.username}`}>
          <IonAvatar>
            <img
              src={
                message.author.profilePicture ??
                userStore?.getAvatarProfilePictureUrl(message.author.username)
              }
              alt="profile"
            />
          </IonAvatar>
        </Link>
        <div className="chat-message__text">{message.text}</div>
      </IonRow>
    );
  })
);
