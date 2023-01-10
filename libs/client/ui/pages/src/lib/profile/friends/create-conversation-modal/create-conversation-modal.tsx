import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';
import {
  friendsStore,
  FriendsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { FriendSearchResult } from '@bregenz-bewegt/shared/types';
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
  trigger: string;
}

export const CreateConversationModal: React.FC<CreateConversationModalProps> =
  inject(
    userStore.storeKey,
    friendsStore.storeKey
  )(
    observer(({ userStore, trigger }) => {
      const modalRef = useRef<HTMLIonModalElement>(null);
      const [presentDefaultErrorToast] = useDefaultErrorToast();
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const [searchText, setSearchText] = useState<string>('');
      const [searchResult, setSearchResult] = useState<FriendSearchResult[]>(
        []
      );

      const dismissAddModal = () => {
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
          ?.searchFriend({ username: query })
          .then((result) => {
            setSearchResult(result);
            setIsLoading(false);
          })
          .catch(() => {
            setSearchResult([]);
            setIsLoading(false);
          });
      };

      const fetchFriends = () => {
        friendsStore
          ?.fetchFriends()
          .then((result) =>
            setSearchResult(
              result.map((u) => ({
                id: u.id,
                username: u.username,
                profilePicture: u.profilePicture,
              }))
            )
          )
          .catch(() => setSearchResult([]));
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
              <IonTitle>Freund für Chat suchen</IonTitle>
              <IonButtons slot="start">
                <IonButton onClick={() => dismissAddModal()}>Zurück</IonButton>
              </IonButtons>
            </IonToolbar>
            <IonSearchbar
              mode="ios"
              value={searchText}
              onIonChange={(e) => handleSearch(e)}
              debounce={250}
              placeholder="Freunde suchen"
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
                            <IonButton fill="clear" mode="ios">
                              <AddCircle
                                variant="Bold"
                                color={`var(--ion-color-primary)`}
                              />
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