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
  IonRow,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { send } from 'ionicons/icons';
import './conversation.scss';
import { useFormik } from 'formik';

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
    const chat = useFormik({
      initialValues: { message: '' },
      onSubmit: (values, { setSubmitting, setValues }) => {},
    });

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
            <IonGrid>
              <IonRow>{match.params.username}</IonRow>
              <IonRow>{chat.values.message}</IonRow>
            </IonGrid>
          </div>
        </IonContent>
        <IonFooter mode="ios" className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="primary">
              <IonButton>
                <IonIcon slot="end" icon={send}></IonIcon>
              </IonButton>
            </IonButtons>
            <Input
              name="message"
              type="text"
              inputMode="text"
              placeholder="Nachricht"
              value={chat.values.message}
              onChange={chat.handleChange}
              onBlur={chat.handleBlur}
            />
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  })
);
