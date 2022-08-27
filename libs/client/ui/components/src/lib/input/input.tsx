import './input.scss';
import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/react';
import {
  InputChangeEventDetail,
  IonInputCustomEvent,
  TextFieldTypes,
} from '@ionic/core';

export interface InputProps {
  value?: string | number | null;
  type?: TextFieldTypes;
  inputMode?:
    | 'search'
    | 'text'
    | 'email'
    | 'tel'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal';
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  error?: string;
  expand?: boolean;
  className?: string;
  onIonChange?: (event: IonInputCustomEvent<InputChangeEventDetail>) => void;
}

export const Input: React.FC<InputProps> = ({
  value,
  type,
  inputMode,
  placeholder,
  name,
  required,
  disabled,
  label,
  error,
  expand = true,
  className,
  onIonChange,
}) => {
  const inputProps = {
    value,
    type,
    inputMode,
    placeholder,
    name,
    required,
    disabled,
    onIonChange,
  };

  return (
    <div
      className={`input${expand ? ' expand' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      <IonItem lines="none" className={`${error ? 'ion-invalid' : ''}`}>
        {label && <IonLabel position="floating">{label}</IonLabel>}
        <IonInput {...inputProps}></IonInput>
        {error && (
          <IonNote color="danger" slot="error">
            {error}
          </IonNote>
        )}
      </IonItem>
    </div>
  );
};
