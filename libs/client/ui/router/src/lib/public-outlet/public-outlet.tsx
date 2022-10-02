import {
  Onboarding,
  ForgotPassword,
  Login,
  Register,
  ForgotPasswordEmailSent,
  ResetPassword,
} from '@bregenz-bewegt/client-ui-pages';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';

export const PublicOutlet: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route exact path={'/onboarding'} component={Onboarding}></Route>
      <Route exact path={'/forgot-password'} component={ForgotPassword}></Route>
      <Route
        exact
        path={'/reset-password/:token'}
        component={ResetPassword}
      ></Route>
      <Route
        exact
        path={'/email-sent'}
        component={ForgotPasswordEmailSent}
      ></Route>
      <Route exact path={'/login'} component={Login}></Route>
      <Route exact path={'/register'} component={Register}></Route>
      <Route path="">
        <Redirect to="/onboarding" />
      </Route>
    </IonRouterOutlet>
  );
};
