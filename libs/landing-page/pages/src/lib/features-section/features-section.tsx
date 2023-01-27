import { Coin } from '@bregenz-bewegt/shared/ui/components';
import React from 'react';
import './features-section.scss';

export const FeaturesSection: React.FC = () => {
  return (
    <div className="features-section">
      <div className="features-section__collect">
        <Coin />
        <h1>B-Bucks Sammeln</h1>
      </div>
      <div className="features-section__earn-rewards"></div>
    </div>
  );
};
