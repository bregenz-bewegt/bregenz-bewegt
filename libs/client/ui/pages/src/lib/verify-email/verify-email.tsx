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
  isOpen: boolean;
  modalRef: React.Ref<HTMLIonModalElement>;
  modalPresentingElement: HTMLElement;
  modalDismiss?: any;
  onVerifySuccess: () => void;
  userStore?: UserStore;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = inject(
  userStore.storeKey
)(
  observer(
    ({
      isOpen,
      modalRef,
      modalPresentingElement,
      modalDismiss,
      userStore,
    }: VerifyEmailProps) => {
      const modalProps = {
        ref: modalRef,
        presentingElement: modalPresentingElement,
        isOpen: isOpen,
      };

      return (
        <IonModal {...modalProps} canDismiss={false}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Email Bestätigen</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => modalDismiss()}>Bestätigen</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">verify</IonContent>
        </IonModal>
      );
    }
  )
);
