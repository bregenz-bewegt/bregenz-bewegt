import { IonCheckbox, IonLabel } from '@ionic/react';
import { ReactNode } from 'react';
import './checkbox.scss';

export interface CheckboxProps {
  label?: ReactNode;
  checked: boolean;
  className?: string;
  onChange: React.FormEventHandler<HTMLIonCheckboxElement>;
  onBlur: React.FocusEventHandler<HTMLIonCheckboxElement>;
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
    onChange,
    onBlur,
  };

  return (
    <div className={`checkbox${className ? ` ${className}` : ''}`}>
      <IonCheckbox {...checkboxProps} />
      {label && <IonLabel>{label}</IonLabel>}
    </div>
  );
};