import { IonCheckbox, IonLabel } from '@ionic/react';
import { ReactNode } from 'react';
import './checkbox.scss';

export interface CheckboxProps {
  name: string;
  checked: boolean;
  label?: ReactNode;
  className?: string;
  mode?: 'ios' | 'md';
  onChange?: React.FormEventHandler<HTMLIonCheckboxElement>;
  onBlur?: React.FocusEventHandler<HTMLIonCheckboxElement>;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  checked,
  className,
  mode = 'ios',
  onChange,
  onBlur,
}: CheckboxProps) => {
  const checkboxProps = {
    name,
    checked,
    mode,
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
