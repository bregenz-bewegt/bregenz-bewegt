import { IonText } from '@ionic/react';
import './medal.scss';

/* eslint-disable-next-line */
export interface MedalProps {
  text?: string;
  className?: string;
}

export const Medal: React.FC<MedalProps> = ({
  text = '1',
  className,
}: MedalProps) => {
  return (
    <div className={`medal${className ? ` ${className}` : ''}`}>
      <div className="medal__circle medal__circle--gold">
        <IonText>
          <h1>{text}</h1>
        </IonText>
      </div>
      <div className="medal__ribbon medal__ribbon--left"></div>
      <div className="medal__ribbon medal__ribbon--right"></div>
    </div>
  );
};
