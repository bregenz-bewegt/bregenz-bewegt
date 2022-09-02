import { Checkbox, Input } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonLabel,
  IonSpinner,
  IonNote,
} from '@ionic/react';
import { Field, Formik, useFormik } from 'formik';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import './register.scss';

export interface RegisterProps {
  userStore?: UserStore;
}

export const Register: React.FC<RegisterProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRegister = async (values: {
      username: string;
      email: string;
      password: string;
      passwordConfirm: string;
      acceptTos: boolean;
    }) => {
      console.log(values);
    };

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
              <Formik
                initialValues={{
                  username: '',
                  email: '',
                  password: '',
                  passwordConfirm: '',
                  acceptTos: false,
                }}
                onSubmit={(values) => {
                  handleRegister(values);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form>
                    <Input
                      name="username"
                      placeholder="Benutzername"
                      value={values.username}
                      error={touched.username ? errors.username : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="username"
                    ></Input>
                    <Input
                      name="email"
                      placeholder="Email"
                      type="email"
                      inputMode="email"
                      value={values.email}
                      error={touched.email ? errors.email : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="email"
                    ></Input>
                    <Input
                      name="password"
                      placeholder="Passwort"
                      value={values.password}
                      error={touched.password ? errors.password : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="password"
                    ></Input>
                    <Input
                      name="passwordConfirm"
                      placeholder="Passwort bestätigen"
                      value={values.passwordConfirm}
                      error={
                        touched.passwordConfirm
                          ? errors.passwordConfirm
                          : undefined
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="password-confirm"
                    ></Input>
                    <Field
                      name="accept-tos"
                      render={() => (
                        <Checkbox
                          name="accept-tos"
                          className="accept-tos"
                          checked={values.acceptTos}
                          label={
                            <IonNote>
                              Ich akzeptiere die AGBs und Nutzungsbedigungen
                            </IonNote>
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      )}
                    ></Field>
                    <IonButton
                      expand="block"
                      color="primary"
                      onClick={() => handleSubmit()}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <IonLabel>
                          <IonSpinner name="crescent" />
                        </IonLabel>
                      ) : (
                        'Registrieren'
                      )}
                    </IonButton>
                    <IonButton
                      expand="block"
                      color="primary"
                      fill="outline"
                      routerLink="/login"
                      routerDirection="back"
                    >
                      Anmelden
                    </IonButton>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
