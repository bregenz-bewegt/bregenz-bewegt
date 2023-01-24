import React from 'react';
import './mockup.scss';
import phone from './assets/phone.png';

export interface MockupProps {
  src: string;
}

export const Mockup: React.FC<MockupProps> = ({ src }) => {
  return (
    <div className="mockup">
      <iframe src={src} title="web app mockup"></iframe>;
    </div>
  );
};
