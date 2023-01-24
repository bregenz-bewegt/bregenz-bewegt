import React from 'react';
import './mockup.scss';

export interface MockupProps {
  src: string;
}

export const Mockup: React.FC<MockupProps> = ({ src }) => {
  return (
    <div className="mockup">
      <div className="mockup__notch">
        <span className="mockup__notch__speaker"></span>
      </div>
      <div className="mockup__screen">
        <iframe
          className="mockup__screen__iframe"
          src={src}
          title="web app mockup"
        ></iframe>
      </div>
      <div className="mockup__home-indicator"></div>
    </div>
  );
};
