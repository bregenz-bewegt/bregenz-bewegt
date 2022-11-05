import { IonLabel, IonToggle } from '@ionic/react';
import { ReactNode } from 'react';
import './toggle.scss';

export interface ToggleProps {
  name: string;
  checked: boolean;
  label?: ReactNode;
  className?: string;
  mode?: 'ios' | 'md';
  onChange?: any;
  onBlur?: any;
}

export const Toggle: React.FC<ToggleProps> = ({
  name,
  label,
  checked,
  className,
  mode = 'ios',
  onChange,
  onBlur,
}: ToggleProps) => {
  const toggleProps = {
    name,
    checked,
    mode,
    onIonChange: onChange,
    onIonBlur: onBlur,
  };

  return (
    <div className={`toggle${className ? ` ${className}` : ''}`}>
      {label && <IonLabel>{label}</IonLabel>}
      <IonToggle {...toggleProps} />
    </div>
  );
};
