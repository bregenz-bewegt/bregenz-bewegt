import { ArrowLeft2 } from 'iconsax-react';
import { useHistory } from 'react-router-dom';
import './back-button.scss';

export const BackButton: React.FC = () => {
  const history = useHistory();
  return (
    <div onClick={history.goBack} className="back-button">
      <ArrowLeft2 variant="Bold" size={16} color={'var(--ion-color-primary'} />
      Zurück
    </div>
  );
};
