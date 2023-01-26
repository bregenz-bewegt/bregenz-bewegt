import React, { useEffect, useState } from 'react';
import './mockup.scss';
import gsap from 'gsap';

export interface MockupProps {
  src: string;
  onLoadIframe?: () => void;
}

export const Mockup: React.FC<MockupProps> = ({ src, onLoadIframe }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (!isIframeLoaded) return;

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
  }, [isIframeLoaded]);

  const handleLoadIframe = () => {
    setIsIframeLoaded(true);
    onLoadIframe && onLoadIframe();
  };

  return (
    <>
      <div className={`mockup${!isIframeLoaded ? ' offset' : ''}`}>
        <div className="mockup__notch">
          <span className="mockup__notch__speaker"></span>
        </div>
        <div className={`mockup__screen`}>
          <iframe
            onLoad={handleLoadIframe}
            className="mockup__screen__iframe"
            src={src}
            title="web app mockup"
          ></iframe>
        </div>
      </div>
      {!isIframeLoaded ? (
        <div className="mockup-loader">Lade Demo App...</div>
      ) : null}
    </>
  );
};
