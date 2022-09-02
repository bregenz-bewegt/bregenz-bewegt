import { IonCheckboxCustomEvent } from '@ionic/core';
import { CheckboxChangeEventDetail, IonCheckbox, IonLabel } from '@ionic/react';
import { ReactNode } from 'react';
import './checkbox.scss';

export interface CheckboxProps {
  label?: ReactNode;
  checked: boolean;
  className?: string;
  onChange: (
    event: IonCheckboxCustomEvent<CheckboxChangeEventDetail<any>>
  ) => void;
  onBlur: (event: IonCheckboxCustomEvent<void>) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  className,
  onChange,
  onBlur,
}: CheckboxProps) => {
  const checkboxProps = {
    checked,
    onIonChange: onChange,
    onIonBlur: onBlur,
  };

  return (
    <div className={`checkbox${className ? ` ${className}` : ''}`}>
      <IonCheckbox {...checkboxProps} />
      {label && <IonLabel>{label}</IonLabel>}
    </div>
  );
};
