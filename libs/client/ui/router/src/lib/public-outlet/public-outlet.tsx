import {
  Intro,
  ForgotPassword,
  Login,
  Register,
  EmailSent,
} from '@bregenz-bewegt/client-ui-pages';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';

export const PublicOutlet: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route exact path={'/intro'} component={Intro}></Route>
      <Route exact path={'/forgot-password'} component={ForgotPassword}></Route>
      <Route exact path={'/email-sent'} component={EmailSent}></Route>
      <Route exact path={'/login'} component={Login}></Route>
      <Route exact path={'/register'} component={Register}></Route>
      <Route path="">
        <Redirect to="/login" />
      </Route>
    </IonRouterOutlet>
  );
};
