import { IonText } from '@ionic/react';
import './title-banner.scss';

/* eslint-disable-next-line */
export interface TitleBannerProps {
  textSegments?: string[];
}

export const TitleBanner: React.FC<TitleBannerProps> = ({
  textSegments = ['Bregenz', 'Bewegt'],
}) => {
  return (
    <IonText className="title-banner">
      <h1>
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
