import {
  friendsStore,
  FriendsStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonSearchbar,
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
import { User } from '@bregenz-bewegt/client/types';

export interface FriendsListProps {
  pageRef: React.MutableRefObject<undefined>;
  friendsStore?: FriendsStore;
}

export const FriendList: React.FC<FriendsListProps> = inject(
  friendsStore.storeKey
)(
  observer(({ friendsStore, pageRef }) => {
    const addModalRef = useRef<HTMLIonModalElement>(null);
    const [presentingElement, setPresentingElement] = useState<
      HTMLElement | undefined
    >(undefined);
    const [searchText, setSearchText] = useState<string>('');
    const [searchResult, setSearchResult] = useState<User[]>([]);

    const handleSearch = (
      e: IonSearchbarCustomEvent<SearchbarChangeEventDetail>
    ) => {
      setSearchText(e.detail.value ?? searchText);

      const query = e.detail.value?.trim().toLowerCase();
      if (!query) return setSearchResult([]);

      friendsStore
        ?.searchUser({ username: query })
        .then((users) => {
          console.log(users);
          setSearchResult(users);
        })
        .catch(() => {
          setSearchResult([]);
        });
    };

    useEffect(() => {
      setPresentingElement(pageRef.current);
    }, []);

    return (
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
        <IonModal
          trigger="open-modal"
          ref={addModalRef}
          presentingElement={presentingElement}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Freund hinzufügen</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => addModalRef.current?.dismiss()}>
                  Abbrechen
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonSearchbar
              style={{ padding: 0 }}
              mode="ios"
              value={searchText}
              onIonChange={(e) => handleSearch(e)}
              debounce={250}
              placeholder="nach Benutzernamen suchen"
            ></IonSearchbar>
            <IonGrid>
              {searchResult.length > 0 ? (
                searchResult.map((u) => {
                  return <IonRow>{u.username}</IonRow>;
                })
              ) : (
                <IonRow>Keine Benutzer gefunden</IonRow>
              )}
            </IonGrid>
          </IonContent>
        </IonModal>
      </div>
    );
  })
);
