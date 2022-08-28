import { Input } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonLabel,
  IonSpinner,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import './login.scss';

/* eslint-disable-next-line */
export interface LoginProps {
  userStore?: UserStore;
}

export const Login: React.FC<LoginProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const { control, getValues, formState } = useForm({
      defaultValues: { email: '', password: '' },
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = (
      e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
    ) => {
      const credentials = getValues();
      const errors = formState.errors;
      console.log(credentials);
      console.log(errors);
      setIsLoading(true);

      userStore
        ?.login(credentials.email, credentials.password)
        .then(() => {
          setIsLoading(false);
          history.push('/start');
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    };

    return (
      <IonPage className="login">
        <IonContent className="login__content" fullscreen>
          <div className="login__flex-wrapper">
            <IonText className="login__content__title">
              <h1>
                Bregenz
                <br />
                Bewegt
              </h1>
            </IonText>
            <div className="login__content__login">
              <IonText>
                <h2>Anmelden</h2>
              </IonText>
              {formState.errors.password?.message}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: { value: true, message: 'Email benötigt' },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Ungültige Email Adresse',
                  },
                }}
                render={({ field, fieldState }) => (
                  <Input
                    ref={field.ref}
                    value={field.value}
                    error={fieldState.error?.message}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    type="email"
                    inputMode="email"
                    placeholder="Email"
                    name="email"
                  ></Input>
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{
                  required: { value: true, message: 'Passwort benötigt' },
                  minLength: {
                    value: 4,
                    message: 'Mindestens 4 Zeichen benötigt',
                  },
                }}
                render={({ field, fieldState }) => (
                  <Input
                    ref={field.ref}
                    value={field.value}
                    error={fieldState.error?.message}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    type="password"
                    inputMode="text"
                    placeholder="Passwort"
                    name="password"
                  />
                )}
              />
              <Link className="login__content__login__forgot-password" to={'#'}>
                Passwort vergessen?
              </Link>
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                onClick={(e) => handleLogin(e)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <IonLabel>
                    <IonSpinner name="crescent">Anmelden</IonSpinner>
                  </IonLabel>
                ) : (
                  'Anmelden'
                )}
              </IonButton>
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                fill="outline"
                routerLink="/register"
              >
                Neu Registrieren
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
