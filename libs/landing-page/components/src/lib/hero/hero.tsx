import React, { useEffect } from 'react';
import { Mockup } from '../mockup/mockup';
import './hero.scss';
import gsap from 'gsap';

/* eslint-disable-next-line */
export interface HeroProps {}

export const Hero: React.FC<HeroProps> = (props: HeroProps) => {
  useEffect(() => {
    gsap.fromTo(
      '.hero__info__text-part',
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 2, stagger: 0.1, ease: 'power4' }
    );
  }, []);

  return (
    <div className="hero">
      <div className="hero__mockup">
        <Mockup src={`${process.env['NX_CLIENT_BASE_URL']}`} />
      </div>
      <div className="hero__info">
        <h1 className="hero__info__text-part">Bregenz</h1>
        <h1 className="hero__info__text-part">Bewegt</h1>
        <h1 className="hero__info__text-part">App</h1>
      </div>
    </div>
  );
};
