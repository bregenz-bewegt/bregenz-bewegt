import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';
import {
  chatStore,
  ChatStore,
  friendsStore,
  FriendsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { User } from '@bregenz-bewegt/client/types';
import { ConversationFriendSearchResult } from '@bregenz-bewegt/shared/types';
import { IonSearchbarCustomEvent } from '@ionic/core';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSearchbar,
  IonList,
  IonRow,
  IonCol,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonLabel,
  SearchbarChangeEventDetail,
} from '@ionic/react';
import { AddCircle } from 'iconsax-react';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import './create-conversation-modal.scss';

export interface CreateConversationModalProps {
  friendsStore?: FriendsStore;
  userStore?: UserStore;
  chatStore?: ChatStore;
  trigger: string;
  onClose: () => void;
}

export const CreateConversationModal: React.FC<CreateConversationModalProps> =
  inject(
    userStore.storeKey,
    friendsStore.storeKey,
    chatStore.storeKey
  )(
    observer(({ userStore, chatStore, trigger, onClose }) => {
      const modalRef = useRef<HTMLIonModalElement>(null);
      const [presentDefaultErrorToast] = useDefaultErrorToast();
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const [searchText, setSearchText] = useState<string>('');
      const [searchResult, setSearchResult] = useState<
        ConversationFriendSearchResult[]
      >([]);

      const dismissAddModal = () => {
        onClose();
        modalRef.current?.dismiss();
      };

      const handleSearch = (
        e: IonSearchbarCustomEvent<SearchbarChangeEventDetail>
      ) => {
        setSearchText(e.detail.value ?? searchText);
        setIsLoading(true);

        const query = e.detail.value?.trim().toLowerCase();
        if (!query) {
          fetchFriends();
          return setIsLoading(false);
        }

        friendsStore
          ?.searchFriend({ username: query, onlyConversationsless: true })
          .then((result) => {
            setSearchResult(
              result.map((r) => ({
                ...r,
                hasConversation: false,
              }))
            );
            setIsLoading(false);
          })
          .catch(() => {
            setSearchResult([]);
            setIsLoading(false);
          });
      };

      const fetchFriends = () => {
        friendsStore
          ?.fetchFriends({ onlyConversationsless: true })
          .then((result) =>
            setSearchResult(
              result.map((u) => ({
                id: u.id,
                username: u.username,
                profilePicture: u.profilePicture,
                hasConversation: false,
              }))
            )
          )
          .catch(() => setSearchResult([]));
      };

      const handleCreateConversation = (participantId: User['id']) => {
        chatStore
          ?.createConversation({ participantId })
          .then((conversation) => {
            setSearchResult((prev) =>
              prev.map((r) =>
                r.id === participantId ? { ...r, hasConversation: true } : r
              )
            );
          })
          .catch(() => {
            presentDefaultErrorToast();
          });
      };

      useEffect(() => {
        fetchFriends();
      }, []);

      return (
        <IonModal
          trigger={trigger}
          ref={modalRef}
          canDismiss
          className="create-conversation-modal"
        >
          <IonHeader mode="ios" collapse="condense" className="ion-no-border">
            <IonToolbar>
              <IonTitle>Neuer Chat</IonTitle>
              <IonButtons slot="start">
                <IonButton onClick={() => dismissAddModal()}>Zurück</IonButton>
              </IonButtons>
            </IonToolbar>
            <IonSearchbar
              mode="ios"
              value={searchText}
              onIonChange={(e) => handleSearch(e)}
              debounce={250}
              placeholder="Freunde für neuen Chat suchen"
            />
          </IonHeader>
          <IonContent className="create-conversation-modal__content">
            <IonList className="friend-user-list">
              {isLoading || searchResult.length > 0
                ? searchResult.map((user) => {
                    return (
                      <IonRow key={user.id}>
                        <IonCol size="auto" className="username-avatar-col">
                          <IonItem
                            key={user.id}
                            routerLink={`/users/${user.id}`}
                            onClick={() => dismissAddModal()}
                            detail={false}
                            lines="none"
                          >
                            <IonAvatar className="avatar" slot="start">
                              {isLoading ? (
                                <IonSkeletonText animated />
                              ) : (
                                <img
                                  src={
                                    user.profilePicture ??
                                    userStore?.getAvatarProfilePictureUrl(
                                      user.username
                                    )
                                  }
                                  alt="avatar"
                                />
                              )}
                            </IonAvatar>
                            <IonLabel>
                              {isLoading ? (
                                <IonSkeletonText animated />
                              ) : (
                                user.username
                              )}
                            </IonLabel>
                          </IonItem>
                        </IonCol>
                        <IonCol size="auto">
                          {!isLoading && (
                            <IonButton
                              fill="clear"
                              mode="ios"
                              // routerLink={`${tabRoutes.profile.route}/chat/${user.username}`}
                              disabled={user.hasConversation}
                              onClick={() => {
                                handleCreateConversation(user.id ?? '');
                              }}
                            >
                              {user.hasConversation ? (
                                'erstellt'
                              ) : (
                                <AddCircle
                                  variant="Bold"
                                  color={`var(--ion-color-primary)`}
                                />
                              )}
                            </IonButton>
                          )}
                        </IonCol>
                      </IonRow>
                    );
                  })
                : searchText && (
                    <IonRow className="no-results">
                      <IonItem lines="none">Keine Benutzer gefunden</IonItem>
                    </IonRow>
                  )}
            </IonList>
          </IonContent>
        </IonModal>
      );
    })
  );
