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
import React from 'react';
import { CreateConversationModal } from '../create-conversation-modal/create-conversation-modal';
import { chatbox } from 'ionicons/icons';
import './chats.scss';
import { MessageText } from 'iconsax-react';

export interface ChatProps {}

export const Chats: React.FC<ChatProps> = ({}) => {
  const modalTrigger = 'create-conversation-modal' as const;

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
          <IonItem button detail>
            <IonAvatar className="avatar" slot="start">
              <img
                src={
                  'data:image/jpeg;base64,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'
                }
                alt="avatar"
              />
            </IonAvatar>
            <IonLabel>
              <h2>Button Item</h2>
              <p>Detail set to true - detail arrow displays on both modes</p>
              <p>Detail icon set to caret-forward-outline</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonGrid>
      <CreateConversationModal trigger={modalTrigger} />
    </div>
  );
};
