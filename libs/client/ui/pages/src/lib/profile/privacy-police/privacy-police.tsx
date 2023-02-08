import React, { createRef, useState } from 'react';
import './privacy-police.scss';
import {
  IonPage,
  IonContent,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  ScrollDetail,
  IonFabButton,
} from '@ionic/react';
import { BackButton } from '@bregenz-bewegt/client-ui-components';
import { PrivacyPoliceContent } from '@bregenz-bewegt/shared/ui/components';
import { ArrowUp2 } from 'iconsax-react';

export interface PrivacyPoliceProps {
  defaultBackRouterLinkt: string;
}

export const PrivacyPolice: React.FC<PrivacyPoliceProps> = ({
  defaultBackRouterLinkt,
}) => {
  const [showTopButton, setShowTopButton] = useState<boolean>(false);
  const contentRef = createRef<HTMLIonContentElement>();

  return (
    <IonPage className="privacy-police">
      <IonHeader mode="ios" collapse="condense" className="ion-no-border">
        <IonToolbar>
          <IonButtons>
            <BackButton
              defaultRouterLink={defaultBackRouterLinkt}
              invertColor
            />
          </IonButtons>
          <IonTitle>Datenschutzerklärung</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="privacy-police__content"
        ref={contentRef}
        scrollEvents={true}
        onIonScroll={(e: CustomEvent<ScrollDetail>) =>
          setShowTopButton(e.detail.currentY > 700 ? true : false)
        }
      >
        <PrivacyPoliceContent />
        <IonFabButton
          slot="fixed"
          className="privacy-police__content__top-button"
          onClick={() => contentRef.current?.scrollToTop(500)}
          style={{ opacity: showTopButton ? 1 : 0 }}
        >
          <ArrowUp2 size={32} color="white" variant="Linear" />
        </IonFabButton>
      </IonContent>
    </IonPage>
  );
};
