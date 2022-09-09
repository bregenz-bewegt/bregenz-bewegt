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
  email: string;
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
      email,
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
          userStore
            ?.verify({ email: email, pin: +values.pin })
            .then(() => {
              setSubmitting(false);
            })
            .catch(() => {
              setSubmitting(false);
            });
        },
      });

      return (
        <IonModal {...modalProps} className="verify-email">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Email Bestätigen</IonTitle>
              <IonButtons slot="end"></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="flex-wrapper">
              <div className="flex-wrapper__content">
                <IonRow className="ion-justify-content-center">
                  <IonText className="verify-text">
                    <p>
                      Bitte bestätige deine E-Mail Adresse mit dem
                      Bestätigungscode, der an{' '}
                      <IonText className="sent-email-address">{}</IonText>{' '}
                      versandt wurde.
                    </p>
                  </IonText>
                </IonRow>
                <OtpInput
                  value={verify.values.pin ?? undefined}
                  onChange={(value) => verify.setFieldValue('pin', value)}
                />
              </div>
              <div className="flex-wrapper__actions">
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
              </div>
            </div>
          </IonContent>
        </IonModal>
      );
    }
  )
);
