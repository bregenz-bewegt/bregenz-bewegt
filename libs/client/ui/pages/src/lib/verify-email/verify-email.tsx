import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import './verify-email.scss';

export interface VerifyEmailProps {
  modalRef: React.Ref<HTMLIonModalElement>;
  modalPresentingElement: HTMLElement;
  modalDismiss?: any;
  userStore?: UserStore;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = inject(
  userStore.storeKey
)(
  observer(
    ({
      modalRef,
      modalPresentingElement,
      modalDismiss,
      userStore,
    }: VerifyEmailProps) => {
      return (
        <IonModal
          ref={modalRef}
          trigger="open-modal"
          presentingElement={modalPresentingElement}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Modal</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => modalDismiss()}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">verify</IonContent>
        </IonModal>
      );
    }
  )
);
