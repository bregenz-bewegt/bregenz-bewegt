import { useIonRouter } from '@ionic/react';
import { ArrowLeft2 } from 'iconsax-react';
import './back-button.scss';

export interface BackButtonProps {
  defaultRouterLink: string;
  invertColor?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  defaultRouterLink,
  invertColor,
}) => {
  const history = useIonRouter();

  return (
    <div
      onClick={() =>
        history.canGoBack()
          ? history.goBack()
          : history.push(defaultRouterLink, 'back')
      }
      className={`back-button${invertColor ? ' invertColor' : ''}`}
    >
      <ArrowLeft2
        variant="Bold"
        size={16}
        color={invertColor ? 'white' : 'var(--ion-color-primary'}
      />
      Zurück
    </div>
  );
};
