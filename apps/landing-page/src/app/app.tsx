import React from 'react';
import { Hero } from '@bregenz-bewegt/landing-page/components';
import './app.module.scss';

export const App: React.FC = () => {
  return (
    <div className="app">
      <Hero />
    </div>
  );
};
