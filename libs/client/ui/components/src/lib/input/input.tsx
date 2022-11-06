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
  clearOnEdit?: boolean;
  className?: string;
  ref?: React.Ref<HTMLIonInputElement>;
  onChange?: (event: IonInputCustomEvent<InputChangeEventDetail>) => void;
  onBlur?: (event: IonInputCustomEvent<FocusEvent>) => void;
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
  clearOnEdit = false,
  ref,
  onChange,
  onBlur,
}) => {
  const inputProps = {
    value,
    type,
    inputMode,
    placeholder: required ? `${placeholder}*` : placeholder,
    name,
    required,
    disabled,
    clearOnEdit,
    ref,
    onIonChange: onChange,
    onIonBlur: onBlur,
  };

  return (
    <div
      className={`input${expand ? ' expand' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      <IonItem lines="none" className={`${error ? 'ion-invalid' : ''}`}>
        {label && <IonLabel position="stacked">{label}</IonLabel>}
        <IonInput
          {...inputProps}
          className={`${error ? 'ion-invalid' : ''}`}
        ></IonInput>
        {error && (
          <IonNote color="danger" slot="error">
            {error}
          </IonNote>
        )}
      </IonItem>
    </div>
  );
};
