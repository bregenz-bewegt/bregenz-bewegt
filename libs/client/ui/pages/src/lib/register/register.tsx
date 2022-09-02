import { Checkbox, Input } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import { LoginCredentials } from '@bregenz-bewegt/client/types';
import { IonCheckboxCustomEvent } from '@ionic/core';
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonInput,
  IonLabel,
  IonSpinner,
  IonCheckbox,
  CheckboxChangeEventDetail,
} from '@ionic/react';
import { useFormik } from 'formik';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './register.scss';

export interface RegisterProps {
  userStore?: UserStore;
}

export const Register: React.FC<RegisterProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const profile = useFormik({
      initialValues: {
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        agbAccept: false,
      },
      onSubmit: (values) => {
        console.log(values);
      },
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRegister = (
      e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
    ) => {
      //
    };

    console.log(profile.values);

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
                value={profile.values.username}
                error={
                  profile.touched.username ? profile.errors.username : undefined
                }
                onChange={profile.handleChange}
                onBlur={profile.handleBlur}
                className="username"
              ></Input>
              <Input
                name="email"
                placeholder="Email"
                type="email"
                inputMode="email"
                value={profile.values.email}
                error={profile.touched.email ? profile.errors.email : undefined}
                onChange={profile.handleChange}
                onBlur={profile.handleBlur}
                className="email"
              ></Input>
              <Input
                name="password"
                placeholder="Passwort"
                value={profile.values.password}
                error={
                  profile.touched.password ? profile.errors.password : undefined
                }
                onChange={profile.handleChange}
                onBlur={profile.handleBlur}
                className="password"
              ></Input>
              <Input
                name="password-confirm"
                placeholder="Passwort bestätigen"
                value={profile.values.passwordConfirm}
                error={
                  profile.touched.passwordConfirm
                    ? profile.errors.passwordConfirm
                    : undefined
                }
                onChange={profile.handleChange}
                onBlur={profile.handleBlur}
                className="password-confirm"
              ></Input>
              <Checkbox
                checked={profile.values.agbAccept}
                onChange={profile.handleChange}
                onBlur={profile.handleBlur}
              />
              <IonButton
                expand="block"
                color="primary"
                onClick={(e) => handleRegister(e)}
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
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
