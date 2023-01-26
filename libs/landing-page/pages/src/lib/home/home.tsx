import React, { useEffect } from 'react';
import './home.scss';
import { Hero } from '@bregenz-bewegt/landing-page/components';
import gsap from 'gsap';

export const Home: React.FC = () => {
  useEffect(() => {
    gsap.fromTo('.home', {}, {});
  }, []);

  return (
    <div className="home">
      <Hero />
    </div>
  );
};
