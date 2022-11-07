import React from 'react';
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

export interface EmailProps {
  userStore?: UserStore;
}

export const Email: React.FC<EmailProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const email = useFormik({
      initialValues: {
        email: userStore?.user?.email,
      },
      validationSchema: changeEmailSchema,
      onSubmit: (values, { setSubmitting, setErrors }) => {
        console.log(values);
      },
    });

    return (
      <IonPage>
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
        </IonContent>
      </IonPage>
    );
  })
);
