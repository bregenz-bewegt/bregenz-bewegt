import { OtpInput } from '@bregenz-bewegt/client-ui-components';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonModal,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useFormik } from 'formik';
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

      const verify = useFormik({
        initialValues: {
          pin: '',
        },
        onSubmit: (values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 2000);
        },
      });

      return (
        <IonModal {...modalProps} className="very-email">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Email Bestätigen</IonTitle>
              <IonButtons slot="end"></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <OtpInput
              value={verify.values.pin ?? undefined}
              onChange={(value) => verify.setFieldValue('pin', value)}
            />
            <IonButton
              className="verify-button"
              mode="ios"
              expand="block"
              onClick={() => verify.submitForm()}
            >
              {verify.isSubmitting ? (
                <IonLabel>
                  <IonSpinner name="crescent" />
                </IonLabel>
              ) : (
                'Email Bestätigen'
              )}
            </IonButton>
            <IonRow className="ion-justify-content-center">
              <IonText
                className="text-center"
                color="primary"
                onClick={() => modalDismiss()}
              >
                <p>Abbrechen</p>
              </IonText>
            </IonRow>
          </IonContent>
        </IonModal>
      );
    }
  )
);
