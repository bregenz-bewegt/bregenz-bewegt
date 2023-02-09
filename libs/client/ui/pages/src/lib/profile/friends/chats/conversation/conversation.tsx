import {
  BackButton,
  ChatDateDivider,
  ChatMessage,
  Input,
} from '@bregenz-bewegt/client-ui-components';
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
  useIonRouter,
  useIonViewDidEnter,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
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
      onSubmit: (values, { resetForm }) => {
        if (!values.message) return;

        socket?.emit(
          'message.create',
          { text: values.message, conversationId: conversation?.id ?? '' },
          () => {
            resetForm();
          }
        );
      },
    });
    const bottomViewRef = useRef<HTMLDivElement>(null);

    const navigateBackToFriends = () =>
      router.push(`${tabRoutes.profile.route}/friends`, 'none', 'pop');

    const scrollChatToBottom = () => {
      bottomViewRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const isSameDay = (d1: Date, d2?: Date) => {
      if (!d2) return false;

      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    const refreshSocket = () => {
      userStore?.getTokens().then((tokens) => {
        setSocket(connectChatSocket(tokens.access_token));
      });
    };

    useIonViewWillEnter(() => {
      tabStore?.setIsShown(false);
    }, []);

    useIonViewDidEnter(() => {
      scrollChatToBottom();
    }, []);

    useIonViewWillLeave(() => {
      tabStore?.setIsShown(true);
    }, []);

    useEffect(() => {
      refreshSocket();

      chatStore
        ?.getConversationWithUser(match.params.username)
        .then((result) => {
          setConversation(result);
        })
        .catch(() => {
          navigateBackToFriends();
        });
    }, [match.params.username, setSocket]);

    useEffect(() => {
      scrollChatToBottom();
    }, [conversation?.messages]);

    useEffect(() => {
      if (!socket) return;

      socket.on('onUnauthorized', () => {
        refreshSocket();
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
        scrollChatToBottom();
      });

      return () => {
        socket.disconnect();
      };
    }, [socket]);

    return (
      <IonPage className="conversation">
        <IonHeader mode="ios" collapse="condense" className="ion-no-border">
          <IonToolbar>
            <IonButtons>
              <BackButton
                defaultRouterLink={`${tabRoutes.profile.route}/friends`}
                invertColor
              />
            </IonButtons>
            <IonTitle>{match.params.username}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <IonGrid>
            {conversation?.messages?.map((message, i, messages) => {
              const currentDate = new Date(message.createdAt);
              const previousDate = messages[i - 1]?.createdAt
                ? new Date(messages[i - 1]?.createdAt)
                : undefined;

              return (
                <>
                  {!isSameDay(currentDate, previousDate) ? (
                    <ChatDateDivider
                      key={`chat-divider-${message.createdAt}`}
                      date={currentDate}
                    />
                  ) : null}
                  <ChatMessage
                    key={i}
                    message={{
                      ...message,
                      selfSent: message.author.id === userStore?.user?.id,
                    }}
                  />
                </>
              );
            })}
            <div className="scroll-bottom" ref={bottomViewRef}></div>
          </IonGrid>
        </IonContent>
        <IonFooter mode="ios" className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="primary">
              <IonButton onClick={() => chat.submitForm()}>
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
