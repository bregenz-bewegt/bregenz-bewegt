import React, { useEffect } from 'react';
import './home.scss';
import { Hero } from '@bregenz-bewegt/landing-page/components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { FeaturesSection } from '../features-section/features-section';

gsap.registerPlugin(ScrollTrigger);

export const Home: React.FC = () => {
  useEffect(() => {
    gsap.fromTo('.home', {}, {});

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.features-section__collect',
        start: 'top 20%',
        toggleActions: 'play complete reverse complete',
        markers: true,
        scrub: 1,
        end: '+=50%',
      },
    });

    tl.to('.mockup', {
      ease: 'power1',
      rotationY: '-10deg',
      rotateZ: '10deg',
      duration: 0.1,
      x: 500,
    });
  }, []);

  return (
    <div className="home">
      <Hero />
      <FeaturesSection />
    </div>
  );
};
