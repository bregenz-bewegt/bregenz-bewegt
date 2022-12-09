import {
  IonAvatar,
  IonBadge,
  IonFab,
  IonFabButton,
  IonHeader,
  IonRouterLink,
  IonSkeletonText,
  IonText,
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
import { useState } from 'react';
import { Notification } from 'iconsax-react';

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
            <Notification
              variant="Bold"
              className="header__fab__fab-button__icon"
            />
          </IonFabButton>
        </IonFab>
      </IonHeader>
    );
  })
);
