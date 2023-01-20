import { IonText } from '@ionic/react';
import React from 'react';
import './title-banner.scss';

export interface TitleBannerProps {
  textSegments?: string[];
  animated?: boolean;
}

export const TitleBanner: React.FC<TitleBannerProps> = ({
  textSegments = ['Bregenz', 'bewegt'],
  animated = false,
}) => {
  return (
    <IonText className="title-banner">
      <h1 className={`${animated ? `animated` : ``}`}>
        {textSegments.map((segment, i, arr) => {
          return i === arr.length - 1 ? (
            segment
          ) : (
            <>
              {segment}
              <br />
            </>
          );
        })}
      </h1>
    </IonText>
  );
};

export const TitleBanner2: React.FC = () => {
  return (
    <div className="title-banner-2">
      <h2>Kemi</h2>
      <h2>Kemi</h2>
    </div>
  );
};
