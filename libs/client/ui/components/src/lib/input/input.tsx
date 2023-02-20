import './input.scss';
import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/react';
import {
  InputChangeEventDetail,
  IonInputCustomEvent,
  TextFieldTypes,
} from '@ionic/core';
import {
  AutocompleteTypes,
  InputModeTypes,
} from '@bregenz-bewegt/client/types';

export interface InputProps {
  value?: string | number | null;
  type?: TextFieldTypes;
  inputMode?: InputModeTypes;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  error?: string;
  expand?: boolean;
  clearOnEdit?: boolean;
  autocomplete?: AutocompleteTypes;
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
  autocomplete,
  ref,
  onChange,
  onBlur,
}) => {
  const inputProps = {
    value,
    type,
    inputMode,
    placeholder,
    name,
    required,
    disabled,
    clearOnEdit,
    autocomplete,
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
