import { useIonToast } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';

export function useDefaultErrorToast(): [() => Promise<void>] {
  const [presentToast] = useIonToast();

  function presentDefaultErrorToast() {
    return presentToast({
      message: 'Etwas ist schiefgelaufen',
      icon: closeCircleOutline,
      duration: 2000,
      position: 'top',
      mode: 'ios',
      color: 'danger',
    });
  }

  return [presentDefaultErrorToast];
}
