import { IonCheckbox, IonLabel } from '@ionic/react';
import { ReactNode } from 'react';
import './checkbox.scss';

export interface CheckboxProps {
  name: string;
  checked: boolean;
  label?: ReactNode;
  valid?: boolean;
  className?: string;
  mode?: 'ios' | 'md';
  onChange?: any;
  onBlur?: any;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  checked,
  valid = true,
  className,
  mode = 'ios',
  onChange,
  onBlur,
}: CheckboxProps) => {
  const checkboxProps = {
    name,
    checked,
    mode,
    onIonChange: onChange,
    onIonBlur: onBlur,
  };

  return (
    <div className={`checkbox${className ? ` ${className}` : ''}`}>
      <IonCheckbox {...checkboxProps} className={!valid ? `ion-invalid` : ''} />
      {label && <IonLabel>{label}</IonLabel>}
    </div>
  );
};
