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

/* eslint-disable-next-line */
export interface HeaderProps {}

export const Header = (props: HeaderProps) => {
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
          <img src="https://i.pravatar.cc/150?img=4" alt="profile" />
        </IonAvatar>
      </Link>
    </IonHeader>
  );
};

export default Header;
