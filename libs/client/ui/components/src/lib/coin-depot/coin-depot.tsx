import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { IonCard, IonCardContent, IonCardHeader } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import './coin-depot.scss';

export interface CoinDepotProps {
  userStore?: UserStore;
}

export const CoinDepot: React.FC<CoinDepotProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    return (
      <IonCard className="coin-depot" color="secondary">
        <IonCardHeader></IonCardHeader>
        <IonCardContent>test</IonCardContent>
      </IonCard>
    );
  })
);
