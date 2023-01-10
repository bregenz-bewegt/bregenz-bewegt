import { IonGrid, IonRow, IonText, IonList } from '@ionic/react';
import React from 'react';
import './chats.scss';

export interface ChatProps {}

export const Chats: React.FC<ChatProps> = ({}) => {
  return (
    <div className="chats">
      <IonGrid>
        <IonRow>
          <IonText>
            <h2>Chats</h2>
          </IonText>
        </IonRow>
        <IonList className=""></IonList>
      </IonGrid>
    </div>
  );
};
