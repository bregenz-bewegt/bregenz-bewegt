import React, { useEffect, useState } from 'react';
import './hero.scss';
import { Mockup } from '../mockup/mockup';
import gsap from 'gsap';

/* eslint-disable-next-line */
export interface HeroProps {}

export const Hero: React.FC<HeroProps> = (props: HeroProps) => {
  const titleSnippets = ['Bregenz', 'Bewegt', 'App'];
  const [isMockupLoaded, setIsMockupLoaded] = useState<boolean>(false);

  const onMockupLoaded = () => {
    setIsMockupLoaded(true);
  };

  useEffect(() => {
    if (isMockupLoaded) {
      gsap.fromTo(
        '.hero__bow',
        {
          opacity: 0,
          height: '0%',
        },
        {
          opacity: 1,
          height: '30%',
          duration: 1,
        }
      );
    } else {
      gsap.fromTo(
        '.hero__info__text-part__hidden',
        { y: '100%' },
        { y: 0, duration: 1, stagger: 0.15, ease: 'power4.easeOut' }
      );
    }
  }, [isMockupLoaded]);

  return (
    <div className="hero">
      <div className="hero__mockup">
        <Mockup
          src={`${process.env['NX_CLIENT_BASE_URL']}`}
          onLoadIframe={onMockupLoaded}
        />
      </div>
      <div className="hero__info">
        {titleSnippets.map((snippet) => (
          <h1 className="hero__info__text-part">
            <span className="hero__info__text-part__hidden">
              {snippet.split('').map((letter) => (
                <span className="hero__info__text-part__hidden__letter">
                  {letter}
                </span>
              ))}
            </span>
          </h1>
        ))}
      </div>
      <div className="hero__bow"></div>
    </div>
  );
};
