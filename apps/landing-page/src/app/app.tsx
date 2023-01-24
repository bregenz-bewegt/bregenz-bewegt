import React from 'react';
import { Footer, Hero } from '@bregenz-bewegt/landing-page/components';
import '../theme/index.scss';

export const App: React.FC = () => {
  return (
    <div className="app">
      <Hero />
      <Footer />
    </div>
  );
};
