import {
  IonGrid,
  IonRow,
  IonText,
  IonButton,
  IonLabel,
  IonSpinner,
  useIonRouter,
} from '@ionic/react';
import React, { ReactNode, useState } from 'react';
import { Lock } from 'iconsax-react';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { Role } from '@bregenz-bewegt/client/types';
import { inject, observer } from 'mobx-react';
import './guest-lock.scss';

export interface GuestLockProps {
  text: string;
  children: ReactNode;
  userStore?: UserStore;
}

export const GuestLock: React.FC<GuestLockProps> = inject(userStore.storeKey)(
  observer(({ text, children, userStore }) => {
    const locked = userStore?.user?.role === Role.GUEST;
    const router = useIonRouter();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    const handleLogout = () => {
      setIsLoggingOut(true);
      userStore?.logout().then(() => {
        router.push('/register');
        setIsLoggingOut(false);
      });
    };

    return (
      <>
        {locked && (
          <div className={`guest-lock-modal`}>
            <IonGrid>
              <IonRow>
                <Lock size={32} variant="Bold" className="lock-icon" />
              </IonRow>
              <IonRow className="info">
                <IonText color="primary">{text}</IonText>
              </IonRow>
              <IonRow>
                <IonButton
                  expand="block"
                  mode="ios"
                  fill="solid"
                  onClick={handleLogout}
                >
                  {isLoggingOut ? (
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
