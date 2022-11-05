import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonChip,
  IonIcon,
  IonItem,
  IonRow,
  IonText,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { add } from 'ionicons/icons';
import './coin-depot.scss';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { Role } from '@bregenz-bewegt/client/types';
import { Coin } from '@bregenz-bewegt/client-ui-components';
import { Competitor } from '@bregenz-bewegt/shared/types';

export interface CoinDepotProps {
  competitor?: Competitor;
  userStore?: UserStore;
}

export const CoinDepot: React.FC<CoinDepotProps> = inject(userStore.storeKey)(
  observer(({ competitor, userStore }) => {
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
        <IonCardContent>
          {userStore?.user?.role === Role.USER ? (
            <>
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
            </>
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
