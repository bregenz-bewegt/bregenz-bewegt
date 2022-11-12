import { ArrowLeft2 } from 'iconsax-react';
import { useHistory } from 'react-router-dom';
import './backBtn.scss';

export const BackBtn: React.FC = () => {
  const history = useHistory();
  return (
    <div onClick={history.goBack} className="back-btn">
      <span>
        <ArrowLeft2
          variant="Bold"
          size={16}
          color={'var(--ion-color-primary'}
        />
      </span>
      <span>Zurück</span>
    </div>
  );
};
