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
import { ShieldSecurity } from 'iconsax-react';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import './guest-lock.scss';
import { useIsGuest } from '@bregenz-bewegt/client/common/hooks';

export interface GuestLockProps {
  text: string;
  children?: (isGuest: boolean) => ReactNode;
  userStore?: UserStore;
  modalClassName?: string;
}

export const GuestLock: React.FC<GuestLockProps> = inject(userStore.storeKey)(
  observer(({ text, children, userStore, modalClassName }) => {
    const [isGuest] = useIsGuest();
    const router = useIonRouter();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    const handleLogout = () => {
      setIsLoggingOut(true);
      userStore?.logout().then(() => {
        router.push('/login');
        setIsLoggingOut(false);
      });
    };

    return (
      <>
        {isGuest && (
          <div
            className={`guest-lock-modal${
              modalClassName ? ` ${modalClassName}` : ''
            }`}
          >
            <IonGrid>
              <IonRow>
                <ShieldSecurity
                  size={32}
                  variant="Bold"
                  className="lock-icon"
                />
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
                    'Anmelden'
                  )}
                </IonButton>
              </IonRow>
            </IonGrid>
          </div>
        )}
        <div className={`guest-lock ${isGuest ? 'locked' : ''}`}>
          {children instanceof Function && children(isGuest)}
        </div>
      </>
    );
  })
);
