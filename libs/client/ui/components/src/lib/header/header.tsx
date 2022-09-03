import {
  IonAvatar,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonSkeletonText,
  IonText,
} from '@ionic/react';
import './header.scss';
import { notifications } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';

export interface HeaderProps {
  userStore?: UserStore;
}

export const Header: React.FC<HeaderProps> = inject(userStore.storeKey)(
  observer(() => {
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

    return (
      <IonHeader mode="ios" className="header">
        <div className="header__profile">
          <Link to={tabRoutes.profile.route}>
            <IonAvatar>
              <img
                onLoad={() => setIsImageLoaded(true)}
                src={userStore?.user?.profilePicture}
                alt="profile"
                style={{ display: isImageLoaded ? 'initial' : 'none' }}
              />
              {!isImageLoaded && <IonSkeletonText animated />}
            </IonAvatar>
          </Link>
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
          <IonIcon
            className="header__fab__button__icon"
            icon={notifications}
            color="primary"
          />
        </IonFabButton>
      </IonHeader>
    );
  })
);

export default Header;
