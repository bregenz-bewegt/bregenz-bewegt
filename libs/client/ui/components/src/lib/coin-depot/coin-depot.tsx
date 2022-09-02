import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { add } from 'ionicons/icons';
import './coin-depot.scss';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';

export interface CoinDepotProps {
  userStore?: UserStore;
}

export const CoinDepot: React.FC<CoinDepotProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    return (
      <IonCard className="coin-depot">
        <IonCardHeader>
          <div className="bb-coin">
            <h1>BB</h1>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <IonButton expand="block" routerLink={tabRoutes.start.route}>
            <IonIcon slot="start" icon={add} />
            Mehr Coins verdienen
          </IonButton>
        </IonCardContent>
      </IonCard>
    );
  })
);
