import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { IonCard, IonCardContent } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import './coin-depot.scss';

/* eslint-disable-next-line */
export interface CoinDepotProps {
  userStore?: UserStore;
}

export const CoinDepot: React.FC<CoinDepotProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    return (
      <IonCard className="coin-depot" color="secondary">
        <IonCardContent>test</IonCardContent>
      </IonCard>
    );
  })
);
