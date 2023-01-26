import React from 'react';
import { Footer } from '@bregenz-bewegt/landing-page/components';
import { Home, PrivacyPolice } from '@bregenz-bewegt/landing-page/pages';
import '../theme/index.scss';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

export const App: React.FC = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/privacy-police">
            <PrivacyPolice />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          <Route path="">
            <Redirect to="/" />
          </Route>
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
};
