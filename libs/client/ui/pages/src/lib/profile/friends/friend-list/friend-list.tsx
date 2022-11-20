import {
  friendsStore,
  FriendsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonSearchbar,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
  SearchbarChangeEventDetail,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { add } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { IonSearchbarCustomEvent } from '@ionic/core';
import './friend-list.scss';
import { FriendSearchResult } from '@bregenz-bewegt/shared/types';
import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';
import { AddCircle, CloseCircle } from 'iconsax-react';
import { Friend } from '@bregenz-bewegt/client/types';

export interface FriendsListProps {
  pageRef: React.MutableRefObject<undefined>;
  friendsStore?: FriendsStore;
  userStore?: UserStore;
}

export const FriendList: React.FC<FriendsListProps> = inject(
  friendsStore.storeKey,
  userStore.storeKey
)(
  observer(({ friendsStore, userStore, pageRef }) => {
    const addModalRef = useRef<HTMLIonModalElement>(null);
    const [presentingElement, setPresentingElement] = useState<
      HTMLElement | undefined
    >(undefined);
    const [presentDefaultErrorToast] = useDefaultErrorToast();
    const [friends, setFriends] = useState<Friend[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [searchResult, setSearchResult] = useState<FriendSearchResult[]>([]);
    const [sentRequests, setSentRequests] = useState<FriendSearchResult[]>([]);

    const fetchFriends = () => {
      friendsStore
        ?.fetchFriends()
        .then((data) => {
          setFriends(data);
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const handleSearch = (
      e: IonSearchbarCustomEvent<SearchbarChangeEventDetail>
    ) => {
      setIsLoading(true);
      setSearchText(e.detail.value ?? searchText);

      const query = e.detail.value?.trim().toLowerCase();
      if (!query) return setSearchResult([]);

      friendsStore
        ?.searchUser({ username: query })
        .then((result) => {
          setSearchResult(result);
          setIsLoading(false);
        })
        .catch(() => {
          setSearchResult([]);
          setIsLoading(false);
        });
    };

    const sendFriendRequest = (addressee: FriendSearchResult) => {
      friendsStore
        ?.sendFriendRequest({ addresseeId: addressee.id })
        .then(() => {
          setSentRequests((prev) => [...prev, addressee]);
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const handleRemoveFriend = (friendId: Friend['id']) => {
      friendsStore
        ?.removeFriend({ friendId })
        .then(() => {
          fetchFriends();
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const dismissAddModal = () => {
      addModalRef.current?.dismiss();
    };

    useEffect(() => {
      setPresentingElement(pageRef.current);
      fetchFriends();
    }, []);

    return (
      <>
        <div className="friend-list">
          <IonButton expand="block" mode="ios" id="open-modal">
            <IonIcon slot="start" icon={add} />
            Freund hinzufügen
          </IonButton>
          <IonGrid>
            <IonRow>
              <IonText>
                <h2>Freunde</h2>
              </IonText>
            </IonRow>
            <IonList className="friend-list friend-user-list">
              {friends && friends.length > 0 ? (
                friends.map((friend) => {
                  return (
                    <IonRow key={friend.id}>
                      <IonCol size="auto" className="username-avatar-col">
                        <IonItem
                          key={friend.id}
                          routerLink={`/users/${friend.id}`}
                          detail={false}
                          lines="none"
                          className="friend-user-list--friends"
                        >
                          <IonAvatar className="avatar" slot="start">
                            <img
                              src={
                                friend.profilePicture
                                  ? userStore?.getProfilePictureUrl(
                                      friend.profilePicture
                                    )
                                  : userStore?.getAvatarProfilePictureUrl(
                                      friend.username
                                    )
                              }
                              alt="avatar"
                            />
                          </IonAvatar>
                          <IonLabel>{friend.username}</IonLabel>
                        </IonItem>
                      </IonCol>
                      <IonCol size="auto">
                        <IonButton
                          fill="clear"
                          onClick={() => handleRemoveFriend(friend.id)}
                        >
                          <CloseCircle
                            variant="Bold"
                            color={`var(--ion-color-danger)`}
                          />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  );
                })
              ) : (
                <IonRow className="no-results">
                  <IonItem lines="none">Keine Anfragen</IonItem>
                </IonRow>
              )}
            </IonList>
          </IonGrid>
        </div>
        <IonModal
          trigger="open-modal"
          ref={addModalRef}
          presentingElement={presentingElement}
          className="add-friend-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Freund hinzufügen</IonTitle>
              <IonButtons slot="start">
                <IonButton onClick={() => dismissAddModal()}>Zurück</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="add-friend-modal__content">
            <IonSearchbar
              mode="ios"
              value={searchText}
              onIonChange={(e) => handleSearch(e)}
              debounce={250}
              placeholder="nach Benutzernamen suchen"
            ></IonSearchbar>
            <IonList className="friend-user-list">
              {isLoading || searchResult.length > 0
                ? searchResult.map((user) => {
                    const isRequested =
                      user.isRequested ||
                      sentRequests.some((r) => r.id === user.id);

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
                                    user.profilePicture
                                      ? userStore?.getProfilePictureUrl(
                                          user.profilePicture
                                        )
                                      : userStore?.getAvatarProfilePictureUrl(
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
                              onClick={() => sendFriendRequest(user)}
                              disabled={isRequested}
                            >
                              {isRequested ? (
                                'angefragt'
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
                      <IonItem lines="none">keine Benutzer gefunden</IonItem>
                    </IonRow>
                  )}
            </IonList>
          </IonContent>
        </IonModal>
      </>
    );
  })
);
