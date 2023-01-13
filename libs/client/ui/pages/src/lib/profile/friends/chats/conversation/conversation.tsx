import { BackButton, Input } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  chatStore,
  ChatStore,
  tabStore,
  TabStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  Conversation as ConversationType,
  Message,
  User,
} from '@bregenz-bewegt/client/types';
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
  useIonRouter,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { send } from 'ionicons/icons';
import './conversation.scss';
import { useFormik } from 'formik';
import { connectChatSocket } from '@bregenz-bewegt/client/common/socket';

const socket = connectChatSocket();

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
    const router = useIonRouter();
    const navigateBackToFriends = () =>
      router.push(`${tabRoutes.profile.route}/friends`);
    const [conversation, setConversation] = useState<ConversationType>();
    const chat = useFormik({
      initialValues: { message: '' },
      onSubmit: (values, { setSubmitting, setValues }) => {
        //
      },
    });

    useIonViewWillEnter(() => {
      tabStore?.setIsShown(false);
    }, []);

    useIonViewWillLeave(() => {
      tabStore?.setIsShown(true);
    }, []);

    const sendMessage = (text: string) => {
      socket.emit('message.create', { text }, () => {
        chat.resetForm();
      });
    };

    useEffect(() => {
      chatStore
        ?.getConversationWith(match.params.username)
        .then((result) => {
          setConversation(result);
        })
        .catch(() => {
          navigateBackToFriends();
        });

      socket.on('onCreateMessage', (message: Message) => {
        console.log(message);

        setConversation((prev) =>
          !prev
            ? prev
            : {
                ...prev,
                messages: [...(prev?.messages ?? []), message],
              }
        );
      });
    }, [match.params.username]);

    console.log(conversation);

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
          <IonGrid>
            <IonRow>{match.params.username}</IonRow>
            {conversation?.messages.map((message) => {
              return <IonRow key={message.id}>{message.text}</IonRow>;
            })}
          </IonGrid>
        </IonContent>
        <IonFooter mode="ios" className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="primary">
              <IonButton onClick={() => sendMessage(chat.values.message)}>
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
