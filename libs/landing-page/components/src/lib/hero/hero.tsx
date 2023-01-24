import { useEffect } from 'react';
import { Mockup } from '../mockup/mockup';
import './hero.scss';
import gsap from 'gsap';

/* eslint-disable-next-line */
export interface HeroProps {}

export const Hero: React.FC<HeroProps> = (props: HeroProps) => {
  useEffect(() => {
    gsap.fromTo('.mockup', { x: -300 }, { x: 0, duration: 2, ease: 'power4' });
  }, []);

  return (
    <div className="hero">
      <div className="hero__mockup">
        <Mockup src={`${process.env['NX_CLIENT_BASE_URL']}`} />
      </div>
      <div className="hero__info">
        <h1>
          Bregenz <br />
          Bewegt <br />
          App
        </h1>
      </div>
    </div>
  );
};
