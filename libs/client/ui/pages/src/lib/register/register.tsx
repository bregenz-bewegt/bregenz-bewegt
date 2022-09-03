import { Checkbox, Input } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import { registerSchema } from '@bregenz-bewegt/client/common/validation';
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonLabel,
  IonSpinner,
  IonNote,
} from '@ionic/react';
import { useFormik } from 'formik';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import './register.scss';

export interface RegisterProps {
  userStore?: UserStore;
}

export const Register: React.FC<RegisterProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const [acceptTos, setAcceptTos] = useState<boolean>(false);
    const [acceptTosValid, setAcceptTosValid] = useState<boolean>(true);
    const register = useFormik({
      initialValues: {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      validationSchema: registerSchema,
      onSubmit: (values, { setSubmitting, setErrors }) => {
        if (!acceptTos) {
          setAcceptTosValid(false);
          return setSubmitting(false);
        }

        userStore
          ?.register(values.username, values.email, values.password)
          .then((data) => {
            console.log(data);
            setSubmitting(false);
          })
          .catch((error) => {
            setErrors(error.response.data);
            setSubmitting(false);
          });
      },
    });

    return (
      <IonPage className="register">
        <IonContent className="register__content" fullscreen>
          <div className="register__flex-wrapper">
            <IonText className="register__content__title">
              <h1>
                Bregenz
                <br />
                Bewegt
              </h1>
            </IonText>
            <div className="register__content__wrapper">
              <IonText>
                <h2>Registrieren</h2>
              </IonText>
              <Input
                name="username"
                placeholder="Benutzername"
                value={register.values.username}
                error={
                  register.touched.username
                    ? register.errors.username
                    : undefined
                }
                onChange={register.handleChange}
                onBlur={register.handleBlur}
                className="username"
              ></Input>
              <Input
                name="email"
                placeholder="Email"
                type="email"
                inputMode="email"
                value={register.values.email}
                error={
                  register.touched.email ? register.errors.email : undefined
                }
                onChange={register.handleChange}
                onBlur={register.handleBlur}
                className="email"
              ></Input>
              <Input
                name="password"
                placeholder="Passwort"
                type="password"
                value={register.values.password}
                error={
                  register.touched.password
                    ? register.errors.password
                    : undefined
                }
                onChange={register.handleChange}
                onBlur={register.handleBlur}
                className="password"
              ></Input>
              <Input
                name="passwordConfirmation"
                placeholder="Passwort bestätigen"
                type="password"
                value={register.values.passwordConfirmation}
                error={
                  register.touched.passwordConfirmation
                    ? register.errors.passwordConfirmation
                    : undefined
                }
                onChange={register.handleChange}
                onBlur={register.handleBlur}
                className="password-confirmation"
              ></Input>
              <Checkbox
                name="accept-tos"
                className="accept-tos"
                checked={acceptTos}
                valid={acceptTosValid}
                label={
                  <IonNote mode="md">
                    Ich akzeptiere die AGBs und Nutzungsbedigungen
                  </IonNote>
                }
                onChange={(e: any) => {
                  setAcceptTos(e.currentTarget.checked);
                  setAcceptTosValid(true);
                }}
              />
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                onClick={() => {
                  if (!acceptTos) setAcceptTosValid(false);
                  register.submitForm();
                }}
                disabled={register.isSubmitting}
              >
                {register.isSubmitting ? (
                  <IonLabel>
                    <IonSpinner name="crescent" />
                  </IonLabel>
                ) : (
                  'Registrieren'
                )}
              </IonButton>
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                fill="outline"
                routerLink="/login"
                routerDirection="back"
              >
                Anmelden
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
