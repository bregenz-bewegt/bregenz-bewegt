import { useIonRouter } from '@ionic/react';
import { ArrowLeft2 } from 'iconsax-react';
import './back-button.scss';

export interface BackButtonProps {
  defaultRouterLink: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  defaultRouterLink,
}) => {
  const history = useIonRouter();

  return (
    <div
      onClick={() =>
        history.canGoBack()
          ? history.goBack()
          : history.push(defaultRouterLink, 'back')
      }
      className="back-button"
    >
      <ArrowLeft2 variant="Bold" size={16} color={'var(--ion-color-primary'} />
      Zurück
    </div>
  );
};
