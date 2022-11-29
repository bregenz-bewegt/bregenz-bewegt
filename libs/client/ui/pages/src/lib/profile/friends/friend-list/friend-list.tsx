import {
  friendsStore,
  FriendsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { add } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';
import { CloseCircle } from 'iconsax-react';
import { Friend } from '@bregenz-bewegt/client/types';
import './friend-list.scss';
import { AddFriendModal } from '../add-friend-modal/add-friend-modal';

export interface FriendsListProps {
  friendsStore?: FriendsStore;
  userStore?: UserStore;
}

export const FriendList: React.FC<FriendsListProps> = inject(
  friendsStore.storeKey,
  userStore.storeKey
)(
  observer(({ friendsStore, userStore }) => {
    const modalTrigger = 'open-add-friend-modal' as const;
    const [presentDefaultErrorToast] = useDefaultErrorToast();
    const [friends, setFriends] = useState<Friend[]>();

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

    useEffect(() => {
      fetchFriends();
    }, []);

    return (
      <div className="friend-list">
        <IonButton expand="block" mode="ios" id={modalTrigger}>
          <IonIcon slot="start" icon={add} />
          Freunde hinzufügen
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
                              friend.profilePicture ??
                              userStore?.getAvatarProfilePictureUrl(
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
                <IonItem lines="none">Keine Freunde</IonItem>
              </IonRow>
            )}
          </IonList>
        </IonGrid>
        <AddFriendModal trigger={modalTrigger} />
      </div>
    );
  })
);
