import {
  IonAvatar,
  IonBadge,
  IonFab,
  IonFabButton,
  IonHeader,
  IonRouterLink,
  IonSkeletonText,
  IonText,
  useIonViewDidEnter,
} from '@ionic/react';
import './header.scss';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  friendsStore,
  FriendsStore,
  notificationsStore,
  NotificationsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import { Notification as NotificationIcon } from 'iconsax-react';
import { Notification } from '@bregenz-bewegt/client/types';
import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';

export interface HeaderProps {
  userStore?: UserStore;
  notificationsStore?: NotificationsStore;
  friendsStore?: FriendsStore;
}

export const Header: React.FC<HeaderProps> = inject(
  userStore.storeKey,
  notificationsStore.storeKey,
  friendsStore.storeKey
)(
  observer(({ userStore, notificationsStore, friendsStore }) => {
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const [presentDefaultErrorToast] = useDefaultErrorToast();

    const fetchFriendRequests = () => {
      friendsStore
        ?.getAllFriendRequests()
        .then((data) => {
          console.log(data.received);
          data.received &&
            data.received.length > 0 &&
            data.received.forEach((r) => {
              if (notificationsStore?.notifications.some((n) => n.id === r.id))
                return;

              notificationsStore?.addNotifications([
                {
                  id: r.id,
                  title: 'Freundschaftsanfrage',
                  description: `${r.requestee.username} hat dir eine Freundschaftsanfrage gesendet`,
                  routerLink: `${tabRoutes.profile.route}/friends`,
                } as Notification,
              ]);
            });
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    useIonViewDidEnter(() => {
      fetchFriendRequests();
    }, []);

    return (
      <IonHeader mode="ios" className="header">
        <div className="header__profile">
          <IonRouterLink
            routerLink={tabRoutes.profile.route}
            routerDirection="forward"
          >
            <IonAvatar>
              <img
                onLoad={() => setIsImageLoaded(true)}
                src={
                  userStore?.user?.profilePicture ??
                  userStore?.getAvatarProfilePictureUrl()
                }
                alt="profile"
                style={{ display: isImageLoaded ? 'initial' : 'none' }}
              />
              {!isImageLoaded && <IonSkeletonText animated />}
            </IonAvatar>
          </IonRouterLink>
          <div className="header__profile__greeting">
            <IonText>
              {isImageLoaded ? 'Guten Tag' : <IonSkeletonText animated />}
            </IonText>
            <IonText className="header__profile__greeting__username">
              {isImageLoaded ? (
                userStore?.user?.username
              ) : (
                <IonSkeletonText animated />
              )}
            </IonText>
          </div>
        </div>
        <IonFab className="header__fab">
          {!notificationsStore?.read &&
            notificationsStore?.notifications &&
            notificationsStore.notifications?.length > 0 && (
              <IonBadge className="header__fab__badge">
                {notificationsStore.notifications.length}
              </IonBadge>
            )}
          <IonFabButton
            className="header__fab__fab-button"
            routerLink={`/notifications`}
          >
            <NotificationIcon
              variant="Bold"
              className="header__fab__fab-button__icon"
            />
          </IonFabButton>
        </IonFab>
      </IonHeader>
    );
  })
);
