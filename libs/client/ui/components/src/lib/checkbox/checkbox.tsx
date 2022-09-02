import { IonCheckboxCustomEvent } from '@ionic/core';
import {
  CheckboxChangeEventDetail,
  IonCheckbox,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { ReactNode } from 'react';
import './checkbox.scss';

export interface CheckboxProps {
  label?: ReactNode;
  checked: boolean;
  onChange: (
    event: IonCheckboxCustomEvent<CheckboxChangeEventDetail<any>>
  ) => void;
  onBlur: (event: IonCheckboxCustomEvent<void>) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  onBlur,
}: CheckboxProps) => {
  const checkboxProps = {
    checked,
    onIonChange: onChange,
    onIonBlur: onBlur,
  };

  return (
    <div className="checkbox">
      <IonItem>
        <IonCheckbox {...checkboxProps} />
        {label && <IonLabel>{label}</IonLabel>}
      </IonItem>
    </div>
  );
};
