import React, { useEffect, useState } from 'react';
import './mockup.scss';
import gsap from 'gsap';
import startFrame from './img/screen/start.png';
import analyticsFrame from './img/screen/analytics.png';
import parkDetailFrame from './img/screen/park-detail.png';
import exerciseDetailFrame from './img/screen/exercise-detail.png';
import profileFrame from './img/screen/profile.png';

export const Mockup: React.FC = () => {
  const [isDemoLoaded, setIsDemoLoaded] = useState<boolean>(false);
  const frames = [
    startFrame,
    parkDetailFrame,
    exerciseDetailFrame,
    analyticsFrame,
    profileFrame,
  ] as const;

  useEffect(() => {
    if (isDemoLoaded) {
      animateFrames(1.5, 5);
      return;
    }

    gsap.fromTo(
      '.mockup',
      {
        x: -300,
        opacity: 0,
        rotateX: '30deg',
        rotateY: '10deg',
        rotateZ: '-20deg',
      },
      {
        x: 0,
        rotateX: '0deg',
        rotateY: '0deg',
        rotateZ: '0deg',
        opacity: 1,
        duration: 2,
        ease: 'power4',
      }
    );

    setIsDemoLoaded(true);
  }, [isDemoLoaded]);

  const animateFrames = (fadeDuration: number, stayDuration: number) => {
    const tl = gsap.timeline({ repeat: -1 });
    const images: any = gsap.utils.toArray('.mockup__screen__frame');

    gsap.set(images[0], { autoAlpha: 1 });

    tl.to(images.slice(1), {
      delay: stayDuration,
      autoAlpha: 1,
      duration: fadeDuration,
      stagger: stayDuration + fadeDuration,
    })
      .to(
        images.slice(0, images.length - 1),
        { autoAlpha: 0, duration: 0.01, stagger: stayDuration + fadeDuration },
        stayDuration + fadeDuration
      )
      .set(images[0], { autoAlpha: 1 })
      .to(
        images[images.length - 1],
        { autoAlpha: 0, duration: fadeDuration },
        '+=' + stayDuration
      );
  };

  return (
    <div className={`mockup`}>
      <div className="mockup__notch">
        <span className="mockup__notch__speaker"></span>
      </div>
      <div className={`mockup__screen`}>
        {frames.map((frame, i) => (
          <img
            className={`mockup__screen__frame frame--${i + 1}`}
            src={frame}
            alt="frame"
          />
        ))}
      </div>
    </div>
  );
};
