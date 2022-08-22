import { IonAvatar, IonFab, IonFabButton } from '@ionic/react';
import './header.scss';

/* eslint-disable-next-line */
export interface HeaderProps {}

export const Header = (props: HeaderProps) => {
  return (
    <div>
      <IonAvatar>
        <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
      </IonAvatar>
      <IonFab>
        <IonFabButton></IonFabButton>
      </IonFab>
    </div>
  );
};

export default Header;
