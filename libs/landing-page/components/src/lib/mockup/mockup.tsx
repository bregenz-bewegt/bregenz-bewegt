import React, { useEffect, useState } from 'react';
import './mockup.scss';
import gsap from 'gsap';

export interface MockupProps {
  src: string;
}

export const Mockup: React.FC<MockupProps> = ({ src }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (!isIframeLoaded) return;

    gsap.fromTo('.mockup', { x: -100 }, { x: 0, duration: 2, ease: 'power4' });
  }, [isIframeLoaded]);

  const handleLoadIframe = () => {
    setIsIframeLoaded(true);
  };

  return (
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
  );
};
