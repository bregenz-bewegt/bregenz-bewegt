import {
  IonGrid,
  IonRow,
  IonText,
  IonButton,
  IonLabel,
  IonSpinner,
} from '@ionic/react';
import React, { ReactNode } from 'react';
import { Lock } from 'iconsax-react';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { Role } from '@bregenz-bewegt/client/types';
import { inject, observer } from 'mobx-react';

export interface GuestLockProps {
  children?: ReactNode;
  onCreateAccount?: React.MouseEventHandler<HTMLIonButtonElement>;
  isLoading?: boolean;
  userStore?: UserStore;
}

export const GuestLock: React.FC<GuestLockProps> = inject(userStore.storeKey)(
  observer(({ children, onCreateAccount, isLoading, userStore }) => {
    const locked = userStore?.user?.role === Role.GUEST;

    return (
      <>
        {locked && (
          <div className={`guest-lock-modal`}>
            <IonGrid>
              <IonRow>
                <Lock size={32} variant="Bold" className="lock-icon" />
              </IonRow>
              <IonRow className="info">
                <IonText color="primary">
                  Erstelle ein Konto, um auf dein Profil zugreifen zu können.
                </IonText>
              </IonRow>
              <IonRow>
                <IonButton
                  expand="block"
                  mode="ios"
                  fill="solid"
                  onClick={onCreateAccount}
                >
                  {isLoading ? (
                    <IonLabel>
                      <IonSpinner name="crescent" />
                    </IonLabel>
                  ) : (
                    'Konto erstellen'
                  )}
                </IonButton>
              </IonRow>
            </IonGrid>
          </div>
        )}
        <div className={`guest-lock ${locked ? 'locked' : ''}`}>{children}</div>
      </>
    );
  })
);
