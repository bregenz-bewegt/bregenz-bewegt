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
  notificationsStore,
  NotificationsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Notification as NotificationIcon, MessageText } from 'iconsax-react';
import {
  useDefaultErrorToast,
  useIsGuest,
} from '@bregenz-bewegt/client/common/hooks';
import { Link } from 'react-router-dom';
import { FriendsDisplaySegment } from '@bregenz-bewegt/client/types';

export interface HeaderProps {
  userStore?: UserStore;
  notificationsStore?: NotificationsStore;
}

export const Header: React.FC<HeaderProps> = inject(
  userStore.storeKey,
  notificationsStore.storeKey
)(
  observer(({ userStore, notificationsStore }) => {
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const [isGuest] = useIsGuest();
    const [presentDefaultErrorToast] = useDefaultErrorToast();

    const fetchNotifications = () => {
      if (!userStore?.user?.role || isGuest) return;

      notificationsStore?.fetchNotifications().catch(() => {
        presentDefaultErrorToast();
      });
    };

    useIonViewDidEnter(() => {
      fetchNotifications();
    }, [isGuest]);

    useEffect(() => {
      fetchNotifications();
    }, [userStore?.user?.role]);

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
        {!isGuest && (
          <IonFab className="header__fab header__fab--chat">
            <Link
              to={{
                pathname: `${tabRoutes.profile.route}/friends`,
                state: {
                  segment: FriendsDisplaySegment.Chats,
                } as { segment: FriendsDisplaySegment },
              }}
            >
              <IonFabButton className="header__fab__fab-button">
                <MessageText
                  variant="Bold"
                  className="header__fab__fab-button__icon"
                />
              </IonFabButton>
            </Link>
          </IonFab>
        )}
        <IonFab className="header__fab">
          {notificationsStore?.notifications &&
            notificationsStore.getUnreadNotifications().length > 0 && (
              <IonBadge className="header__fab__badge">
                {notificationsStore.getUnreadNotifications().length}
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
