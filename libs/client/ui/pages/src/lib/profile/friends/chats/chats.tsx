import {
  IonGrid,
  IonRow,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonButton,
  IonIcon,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { CreateConversationModal } from '../create-conversation-modal/create-conversation-modal';
import { chatbox } from 'ionicons/icons';
import './chats.scss';
import {
  chatStore,
  ChatStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { Conversation, User } from '@bregenz-bewegt/client/types';

export interface ChatProps {
  chatStore?: ChatStore;
  userStore?: UserStore;
}

export const Chats: React.FC<ChatProps> = inject(
  chatStore.storeKey,
  userStore.storeKey
)(
  observer(({ chatStore, userStore }) => {
    const modalTrigger = 'create-conversation-modal' as const;
    const [conversations, setConversations] = useState<
      (Conversation & { participants: User[] })[]
    >([]);

    const fetchConversations = () => {
      chatStore
        ?.getConversations()
        .then((result) => {
          setConversations(result);
        })
        .catch(() => {
          setConversations([]);
        });
    };

    useEffect(() => {
      fetchConversations();
    }, []);

    console.log(conversations);

    return (
      <div className="chats">
        <IonButton expand="block" mode="ios" id={modalTrigger}>
          <IonIcon slot="start" icon={chatbox} />
          Neuer Chat
        </IonButton>
        <IonGrid>
          <IonRow>
            <IonText>
              <h2>Chats</h2>
            </IonText>
          </IonRow>
          <IonList className="chats__list">
            {conversations && conversations.length > 0 ? (
              conversations.map((conversation) => {
                const partner = conversation.participants.filter(
                  (p) => p.id !== userStore?.user?.id
                )[0];

                return (
                  <IonItem button detail>
                    <IonAvatar className="avatar" slot="start">
                      <img
                        src={
                          partner.profilePicture ??
                          userStore?.getAvatarProfilePictureUrl(
                            partner.username
                          )
                        }
                        alt="avatar"
                      />
                    </IonAvatar>
                    <IonLabel>
                      <h2>{partner.username}</h2>
                      <p>Neue Nachricht senden</p>
                    </IonLabel>
                  </IonItem>
                );
              })
            ) : (
              <IonRow className="no-results">
                <IonItem lines="none">Keine Chats</IonItem>
              </IonRow>
            )}
          </IonList>
        </IonGrid>
        <CreateConversationModal trigger={modalTrigger} />
      </div>
    );
  })
);
