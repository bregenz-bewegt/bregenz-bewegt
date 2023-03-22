import { Coin } from '@bregenz-bewegt/landing-page/components';
import React from 'react';
import './features-section.scss';

export const FeaturesSection: React.FC = () => {
  return (
    <div className="features-section">
      <div className="features-section__collect">
        <Coin className="features-section__collect__coin" />
        <h1>B-Bucks Sammeln</h1>
      </div>
      <div className="features-section__earn-rewards"></div>
    </div>
  );
};
