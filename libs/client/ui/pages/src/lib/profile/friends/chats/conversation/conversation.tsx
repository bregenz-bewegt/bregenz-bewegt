import { BackButton } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { chatStore, ChatStore } from '@bregenz-bewegt/client/common/stores';
import { User } from '@bregenz-bewegt/client/types';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './conversation.scss';

interface MatchParams {
  username: User['username'];
}

export interface ConversationProps extends RouteComponentProps<MatchParams> {
  chatStore?: ChatStore;
}

export const Conversation: React.FC<ConversationProps> = inject(
  chatStore.storeKey
)(
  observer(({ chatStore, match }) => {
    return (
      <IonPage className="conversation">
        <IonHeader mode="ios" collapse="condense" className="ion-no-border">
          <IonToolbar>
            <IonButtons>
              <BackButton defaultRouterLink={tabRoutes.profile.route} />
            </IonButtons>
            <IonTitle>Chat</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          {match.params.username}
        </IonContent>
      </IonPage>
    );
  })
);
