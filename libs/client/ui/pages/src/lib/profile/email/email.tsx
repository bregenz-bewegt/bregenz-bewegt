import React, { useEffect, useRef, useState } from 'react';
import { BackButton, Input } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { changeEmailSchema } from '@bregenz-bewegt/client/common/validation';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
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
import './email.scss';

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
    const emailForm = useFormik({
      initialValues: {
        email: userStore?.user?.email ?? '',
      },
      validationSchema: changeEmailSchema,
      onSubmit: (values, { setSubmitting, setErrors }) => {
        userStore
          ?.resetEmail({ email: values.email })
          .then((token) => {
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

    useEffect(() => {
      emailForm.resetForm({
        values: {
          email: userStore?.user?.email ?? '',
        },
      });
    }, [userStore?.user?.email]);

    useEffect(() => {
      setVerifyModalPresentingElement(page.current);
    }, []);

    return (
      <IonPage ref={page} className="email">
        <IonHeader mode="ios" collapse="condense" className="ion-no-border">
          <IonToolbar>
            <IonButtons>
              <BackButton
                defaultRouterLink={tabRoutes.profile.route}
                invertColor
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
                value={emailForm.values.email}
                autocomplete="email"
                error={
                  emailForm.touched.email ? emailForm.errors.email : undefined
                }
                onChange={emailForm.handleChange}
                onBlur={emailForm.handleBlur}
              />
            </IonRow>
            <IonButton
              mode="ios"
              expand="block"
              color="primary"
              onClick={() => emailForm.submitForm()}
              disabled={
                emailForm.isSubmitting || !emailForm.dirty || !emailForm.isValid
              }
              className="ion-margin-top"
            >
              {emailForm.isSubmitting ? (
                <IonLabel>
                  <IonSpinner name="crescent" />
                </IonLabel>
              ) : (
                'E-Mail ändern'
              )}
            </IonButton>
          </IonGrid>
          <VerifyEmail
            email={emailForm.values.email}
            isOpen={isVerifyModalOpen}
            modalRef={verifyModal}
            modalPresentingElement={verifyModalPresentingElement!}
            onVerifySubmit={async (_, token) =>
              userStore?.verifyResetEmail({
                token: token,
                authorization: resetToken?.token ?? '',
              })
            }
            onVerifySuccess={async () => setIsVerifyModalOpen(false)}
            modalDismiss={() => verifyModal.current?.dismiss()}
          />
        </IonContent>
      </IonPage>
    );
  })
);
