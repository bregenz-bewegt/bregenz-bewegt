import {
  IonAvatar,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
} from '@ionic/react';
import './header.scss';
import { notifications } from 'ionicons/icons';

/* eslint-disable-next-line */
export interface HeaderProps {}

export const Header = (props: HeaderProps) => {
  return (
    <IonHeader className="header">
      <IonFab className="header__fab">
        <IonFabButton className="header__fab__button">
          <IonIcon
            className="header__fab__button__icon"
            icon={notifications}
            color="primary"
          />
        </IonFabButton>
      </IonFab>
      <IonAvatar className="header__avatar">
        <img src="https://i.pravatar.cc/150?img=3" alt="profile" />
      </IonAvatar>
    </IonHeader>
  );
};

export default Header;
