import { BackButton, Input } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  chatStore,
  ChatStore,
  tabStore,
  TabStore,
  userStore,
  UserStore,
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
import { Socket } from 'socket.io-client';
import {
  ChatClientToServerEvents,
  ChatServerToClientEvents,
} from '@bregenz-bewegt/shared/types';

interface MatchParams {
  username: User['username'];
}

export interface ConversationProps extends RouteComponentProps<MatchParams> {
  chatStore?: ChatStore;
  tabStore?: TabStore;
  userStore?: UserStore;
}

export const Conversation: React.FC<ConversationProps> = inject(
  chatStore.storeKey,
  tabStore.storeKey,
  userStore.storeKey
)(
  observer(({ chatStore, tabStore, userStore, match }) => {
    const router = useIonRouter();
    const [socket, setSocket] =
      useState<Socket<ChatServerToClientEvents, ChatClientToServerEvents>>();

    const [conversation, setConversation] = useState<ConversationType>();
    const chat = useFormik({
      initialValues: { message: '' },
      onSubmit: (values, { setSubmitting, setValues }) => {
        //
      },
    });

    const navigateBackToFriends = () =>
      router.push(`${tabRoutes.profile.route}/friends`);

    useIonViewWillEnter(() => {
      tabStore?.setIsShown(false);
    }, []);

    useIonViewWillLeave(() => {
      tabStore?.setIsShown(true);
    }, []);

    const sendMessage = (text: string) => {
      socket?.emit(
        'message.create',
        { text, conversationId: conversation?.id ?? '' },
        () => {
          chat.resetForm();
        }
      );
    };

    useEffect(() => {
      userStore?.getTokens().then((tokens) => {
        setSocket(connectChatSocket(tokens.access_token));
      });

      chatStore
        ?.getConversationWith(match.params.username)
        .then((result) => {
          setConversation(result);
        })
        .catch(() => {
          navigateBackToFriends();
        });
    }, [match.params.username, setSocket]);

    useEffect(() => {
      if (!socket) return;

      socket.on('connect', () => {
        console.log('connected');
      });

      socket.on('onCreateMessage', (message: Message) => {
        setConversation((prev) =>
          !prev
            ? prev
            : {
                ...prev,
                messages: [...(prev?.messages ?? []), message],
              }
        );
      });
    }, [socket]);

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
