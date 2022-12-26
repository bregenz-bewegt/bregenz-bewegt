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
  autocomplete?:
    | 'on'
    | 'off'
    | 'name'
    | 'honorific-prefix'
    | 'given-name'
    | 'additional-name'
    | 'family-name'
    | 'honorific-suffix'
    | 'nickname'
    | 'email'
    | 'username'
    | 'new-password'
    | 'current-password'
    | 'one-time-code'
    | 'organization-title'
    | 'organization'
    | 'street-address'
    | 'address-line1'
    | 'address-line2'
    | 'address-line3'
    | 'address-level4'
    | 'address-level3'
    | 'address-level2'
    | 'address-level1'
    | 'country'
    | 'country-name'
    | 'postal-code'
    | 'cc-name'
    | 'cc-given-name'
    | 'cc-additional-name'
    | 'cc-family-name'
    | 'cc-family-name'
    | 'cc-number'
    | 'cc-exp'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-csc'
    | 'cc-type'
    | 'transaction-currency'
    | 'transaction-amount'
    | 'language'
    | 'bday'
    | 'bday-day'
    | 'bday-month'
    | 'bday-year'
    | 'sex'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'tel-area-code'
    | 'tel-local'
    | 'tel-extension'
    | 'impp'
    | 'url'
    | 'photo';
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
  autocomplete = 'email',
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
