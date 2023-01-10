import { BackButton, Input } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  chatStore,
  ChatStore,
  tabStore,
  TabStore,
} from '@bregenz-bewegt/client/common/stores';
import { User } from '@bregenz-bewegt/client/types';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  useIonViewWillEnter,
  useIonViewWillLeave,
  IonGrid,
  IonFooter,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { send } from 'ionicons/icons';
import './conversation.scss';

interface MatchParams {
  username: User['username'];
}

export interface ConversationProps extends RouteComponentProps<MatchParams> {
  chatStore?: ChatStore;
  tabStore?: TabStore;
}

export const Conversation: React.FC<ConversationProps> = inject(
  chatStore.storeKey,
  tabStore.storeKey
)(
  observer(({ chatStore, tabStore, match }) => {
    const [message, setMessage] = useState<string>('');

    useIonViewWillEnter(() => {
      tabStore?.setIsShown(false);
    }, []);

    useIonViewWillLeave(() => {
      tabStore?.setIsShown(true);
    }, []);

    return (
      <IonPage className="conversation">
        <IonHeader mode="ios" collapse="condense" className="ion-no-border">
          <IonToolbar>
            <IonButtons>
              <BackButton
                defaultRouterLink={`${tabRoutes.profile.route}/friends`}
              />
            </IonButtons>
            <IonTitle>{match.params.username}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <div>
            <IonGrid>{match.params.username}</IonGrid>
          </div>
        </IonContent>
        <IonFooter mode="ios" className="ion-no-border">
          {/* <Input /> */}
          <IonToolbar>
            <IonButtons slot="secondary">
              <IonButton>
                <IonIcon slot="icon-only" icon={send}></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle>{match.params.username}</IonTitle>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  })
);
