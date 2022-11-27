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
import React, { useRef, useState } from 'react';
import './add-friend-modal.scss';

export interface AddFriendModalProps {
  friendsStore?: FriendsStore;
  userStore?: UserStore;
  trigger: string;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = inject(
  userStore.storeKey,
  friendsStore.storeKey
)(
  observer(({ userStore, trigger }) => {
    const modalRef = useRef<HTMLIonModalElement>(null);
    const [presentDefaultErrorToast] = useDefaultErrorToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [searchResult, setSearchResult] = useState<FriendSearchResult[]>([]);
    const [sentRequests, setSentRequests] = useState<FriendSearchResult[]>([]);

    const dismissAddModal = () => {
      modalRef.current?.dismiss();
    };

    const handleSearch = (
      e: IonSearchbarCustomEvent<SearchbarChangeEventDetail>
    ) => {
      setSearchText(e.detail.value ?? searchText);
      setIsLoading(true);

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

    return (
      <IonModal trigger={trigger} ref={modalRef} canDismiss>
        <IonHeader mode="ios">
          <IonToolbar>
            <IonTitle>Freund hinzufügen</IonTitle>
            <IonButtons slot="start">
              <IonButton onClick={() => dismissAddModal()}>Zurück</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="add-friend-modal__content">
          <IonHeader mode="ios">
            <IonSearchbar
              mode="ios"
              value={searchText}
              onIonChange={(e) => handleSearch(e)}
              debounce={250}
              placeholder="Freunde suchen"
            />
          </IonHeader>
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
                            mode="ios"
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
    );
  })
);
