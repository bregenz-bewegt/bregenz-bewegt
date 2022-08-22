import { IonAvatar, IonFab, IonFabButton, IonHeader } from '@ionic/react';
import './header.scss';

/* eslint-disable-next-line */
export interface HeaderProps {}

export const Header = (props: HeaderProps) => {
  return (
    <IonHeader className="header">
      <IonAvatar className="header__avatar">
        <img src="https://i.pravatar.cc/150?img=3" alt="profile" />
      </IonAvatar>
      <IonFab className="header__fab" horizontal="end">
        <IonFabButton className="header__fab__button"></IonFabButton>
      </IonFab>
    </IonHeader>
  );
};

export default Header;
