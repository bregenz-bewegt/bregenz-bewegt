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
  modalDismiss?: (data?: any, role?: string | undefined) => Promise<boolean>;
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
          token: '',
        },
        validationSchema: verifySchema,
        onSubmit: (values, { setSubmitting, setErrors }) => {
          userStore
            ?.verify({ email: email, token: values.token })
            .then(() => {
              setSubmitting(false);
              onVerifySuccess();
              userStore?.refreshProfile();
              userStore?.setIsLoggedIn(true);
            })
            .catch((error) => {
              setErrors(error.response.data);
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
                  value={verify.values.token ?? undefined}
                  onChange={(value) => verify.setValues({ token: value })}
                  error={verify.errors.token}
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
                    onClick={() => modalDismiss && modalDismiss()}
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
