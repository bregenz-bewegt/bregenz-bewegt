import { userStore } from '@bregenz-bewegt/client/common/stores';
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
import { Coin } from '@bregenz-bewegt/client-ui-components';
import { Competitor } from '@bregenz-bewegt/shared/types';
import { useIsGuest } from '@bregenz-bewegt/client/common/hooks';

export interface CoinDepotProps {
  competitor?: Competitor;
}

export const CoinDepot: React.FC<CoinDepotProps> = inject(userStore.storeKey)(
  observer(({ competitor }) => {
    const [isGuest] = useIsGuest();

    return (
      <IonCard className="coin-depot" color="secondary" mode="ios">
        <IonCardHeader>
          <Coin className="coin-depot__coin" />
          <div className="coin-stats">
            <IonRow>
              <IonText>Du hast</IonText>
            </IonRow>
            <IonRow>
              <IonText>
                <h2>{competitor?.coins} B-Bucks</h2>
              </IonText>
            </IonRow>
          </div>
        </IonCardHeader>
        {!isGuest && (
          <IonCardContent>
            <IonText>
              <h2>
                Jählich werden am 31.12. Preise an die Top 10 Sportler
                verliehen.
                <br />
                Sei dabei und verdien dir einen Preis!
              </h2>
            </IonText>
            <IonButton
              expand="block"
              routerLink={tabRoutes.start.route}
              routerDirection="back"
              mode="ios"
              className="coin-depot__content-button"
            >
              <IonIcon slot="start" icon={add} />
              Mehr Coins verdienen
            </IonButton>
          </IonCardContent>
        )}
      </IonCard>
    );
  })
);
