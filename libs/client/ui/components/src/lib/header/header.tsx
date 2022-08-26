import {
  IonAvatar,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
} from '@ionic/react';
import './header.scss';
import { notifications } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';

export interface HeaderProps {
  userStore?: UserStore;
}

export const Header = inject(userStore.storeKey)(
  observer((props: HeaderProps) => {
    return (
      <IonHeader mode="ios" className="header">
        <IonFab className="header__fab">
          <IonFabButton className="header__fab__button">
            <IonIcon
              className="header__fab__button__icon"
              icon={notifications}
              color="primary"
            />
          </IonFabButton>
        </IonFab>
        <Link to={tabRoutes.profile.route}>
          <IonAvatar className="header__avatar">
            <img src={userStore?.user?.profilePicture} alt="profile" />
          </IonAvatar>
        </Link>
      </IonHeader>
    );
  })
);

export default Header;
