import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { changeEmailSchema } from '@bregenz-bewegt/client/common/validation';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonButton,
  IonLabel,
  IonSpinner,
} from '@ionic/react';
import { useFormik } from 'formik';
import { inject, observer } from 'mobx-react';
import { VerifyEmail } from '../../verify-email/verify-email';
import { EmailResetToken } from '@bregenz-bewegt/shared/types';

export interface EmailProps {
  userStore?: UserStore;
}

export const Email: React.FC<EmailProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const verifyModal = useRef<HTMLIonModalElement>(null);
    const page = useRef(null);
    const [verifyModalPresentingElement, setVerifyModalPresentingElement] =
      useState<HTMLElement | null>(null);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
    const [resetToken, setResetToken] = useState<EmailResetToken>();
    const email = useFormik({
      initialValues: {
        email: userStore?.user?.email ?? '',
      },
      validationSchema: changeEmailSchema,
      onSubmit: (values, { setSubmitting, setErrors }) => {
        userStore
          ?.resetEmail({ email: values.email })
          .then((token) => {
            console.log(token);
            setSubmitting(false);
            setResetToken(token);
            setIsVerifyModalOpen(true);
          })
          .catch((error) => {
            setErrors(error.response.data);
            setSubmitting(false);
          });
      },
    });

    const handleVerifySuccess = async () => {
      setIsVerifyModalOpen(false);
    };

    useEffect(() => {
      email.resetForm({
        values: {
          email: userStore?.user?.email ?? '',
        },
      });
    }, [userStore?.user?.email]);

    useEffect(() => {
      setVerifyModalPresentingElement(page.current);
    }, []);

    return (
      <IonPage ref={page}>
        <IonHeader mode="ios">
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                color="primary"
                defaultHref={tabRoutes.profile.route}
                text="Zurück"
              />
            </IonButtons>
            <IonTitle>E-Mail Adresse ändern</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <IonGrid>
            <IonRow>
              <Input
                name="email"
                placeholder="E-Mail"
                label="E-Mail"
                value={email.values.email}
                error={email.touched.email ? email.errors.email : undefined}
                onChange={email.handleChange}
                onBlur={email.handleBlur}
              />
            </IonRow>
            <IonButton
              mode="ios"
              expand="block"
              color="primary"
              onClick={() => email.submitForm()}
              disabled={email.isSubmitting || !email.dirty}
              className="ion-margin-top"
            >
              {email.isSubmitting ? (
                <IonLabel>
                  <IonSpinner name="crescent" />
                </IonLabel>
              ) : (
                'Ändern'
              )}
            </IonButton>
          </IonGrid>
          <VerifyEmail
            email={email.values.email}
            isOpen={isVerifyModalOpen}
            modalRef={verifyModal}
            modalPresentingElement={verifyModalPresentingElement!}
            onVerifySuccess={handleVerifySuccess}
            modalDismiss={() => verifyModal.current?.dismiss()}
          />
        </IonContent>
      </IonPage>
    );
  })
);
