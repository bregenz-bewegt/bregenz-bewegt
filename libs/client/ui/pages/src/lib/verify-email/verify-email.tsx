import { OtpInput } from '@bregenz-bewegt/client-ui-components';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { verifySchema } from '@bregenz-bewegt/client/common/validation';
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
      onVerifySuccess,
      userStore,
    }: VerifyEmailProps) => {
      const modalProps = {
        ref: modalRef,
        presentingElement: modalPresentingElement,
        isOpen: isOpen,
      };

      const verify = useFormik({
        initialValues: {
          otp: '',
        },
        validationSchema: verifySchema,
        onSubmit: (values, { setSubmitting }) => {
          console.log('fired1');
          userStore
            ?.verify({ email: email, token: values.otp })
            .then(() => {
              userStore.refreshProfile();
              setSubmitting(false);
            })
            .catch((error) => {
              console.log(error);
              setSubmitting(false);
            });
        },
      });

      console.log(verify.errors);

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
                  value={verify.values.otp ?? undefined}
                  onChange={(value) => verify.setValues({ otp: value })}
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
