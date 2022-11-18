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
import { AddCircle } from 'iconsax-react';

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [searchResult, setSearchResult] = useState<FriendSearchResult[]>([]);

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

    const dismissAddModal = () => {
      addModalRef.current?.dismiss();
    };

    useEffect(() => {
      setPresentingElement(pageRef.current);
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
              <IonButtons slot="end">
                <IonButton onClick={() => dismissAddModal()}>
                  Abbrechen
                </IonButton>
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
            <IonList>
              {isLoading || searchResult.length > 0
                ? searchResult.map((user) => {
                    return (
                      <IonRow>
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
                            <IonButton fill="clear">
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
