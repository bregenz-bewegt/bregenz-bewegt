import React from 'react';
import { Footer, Hero } from '@bregenz-bewegt/landing-page/components';
import './app.module.scss';

export const App: React.FC = () => {
  return (
    <div className="app">
      <Hero />
      <Footer />
    </div>
  );
};
