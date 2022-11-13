import { useIonRouter } from '@ionic/react';
import { ArrowLeft2 } from 'iconsax-react';
import './back-button.scss';

export const BackButton: React.FC = () => {
  const history = useIonRouter();
  return (
    <div onClick={() => history.goBack()} className="back-button">
      <ArrowLeft2 variant="Bold" size={16} color={'var(--ion-color-primary'} />
      Zurück
    </div>
  );
};
