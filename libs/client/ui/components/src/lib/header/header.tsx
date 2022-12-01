import {
  IonAvatar,
  IonFabButton,
  IonHeader,
  IonRouterLink,
  IonSkeletonText,
  IonText,
} from '@ionic/react';
import './header.scss';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import { Notification } from 'iconsax-react';

export interface HeaderProps {
  userStore?: UserStore;
}

export const Header: React.FC<HeaderProps> = inject(userStore.storeKey)(
  observer(() => {
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
                  userStore.getAvatarProfilePictureUrl()
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
                userStore.user?.username
              ) : (
                <IonSkeletonText animated />
              )}
            </IonText>
          </div>
        </div>
        <IonFabButton className="header__fab-button">
          <Notification variant="Bold" className="header__fab-button__icon" />
        </IonFabButton>
      </IonHeader>
    );
  })
);
