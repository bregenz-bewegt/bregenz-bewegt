import React, { useEffect } from 'react';
import './hero.scss';
import { Mockup } from '../mockup/mockup';
import gsap from 'gsap';

/* eslint-disable-next-line */
export interface HeroProps {}

export const Hero: React.FC<HeroProps> = (props: HeroProps) => {
  const titleSnippets = ['Bregenz', 'Bewegt', 'App'];

  useEffect(() => {
    gsap.fromTo(
      '.hero__info__text-part__hidden',
      { y: '100%' },
      { y: 0, duration: 1, stagger: 0.2, ease: 'power4.easeOut' }
    );
  }, []);

  return (
    <div className="hero">
      <div className="hero__mockup">
        <Mockup src={`${process.env['NX_CLIENT_BASE_URL']}`} />
      </div>
      <div className="hero__info">
        {titleSnippets.map((s) => (
          <h1 className="hero__info__text-part">
            <span className="hero__info__text-part__hidden">{s}</span>
          </h1>
        ))}
      </div>
      <div className="hero__bow"></div>
    </div>
  );
};
