import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { add } from 'ionicons/icons';
import './coin-depot.scss';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { Role } from '@bregenz-bewegt/client/types';

export interface CoinDepotProps {
  userStore?: UserStore;
}

export const CoinDepot: React.FC<CoinDepotProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    return (
      <IonCard className="coin-depot" color="secondary" mode="ios">
        <IonCardHeader>
          <div className="bb-coin">
            <h1>BB</h1>
          </div>
          <div className="coin-stats">
            <IonRow>
              <IonText>Du hast</IonText>
            </IonRow>
            <IonRow>
              <IonText>
                <h2>{userStore?.user?.coins} Coins</h2>
              </IonText>
            </IonRow>
          </div>
        </IonCardHeader>
        <IonCardContent>
          {userStore?.user?.role === Role.USER ? (
            <IonButton
              expand="block"
              routerLink={tabRoutes.start.route}
              routerDirection="back"
              mode="ios"
            >
              <IonIcon slot="start" icon={add} />
              Mehr Coins verdienen
            </IonButton>
          ) : (
            <IonButton
              expand="block"
              routerLink={tabRoutes.start.route}
              routerDirection="back"
              mode="ios"
            >
              Anmelden um Coins zu verdienen
            </IonButton>
          )}
        </IonCardContent>
      </IonCard>
    );
  })
);
