import './textarea.scss';
import { IonItem, IonLabel, IonNote, IonTextarea } from '@ionic/react';
import {
  TextareaChangeEventDetail,
  IonTextareaCustomEvent,
  TextFieldTypes,
} from '@ionic/core';
import { useState } from 'react';

export interface TextAreaProps {
  value?: string | null;
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
  ref?: React.Ref<HTMLIonTextareaElement>;
  onChange?: (event: IonTextareaCustomEvent<TextareaChangeEventDetail>) => void;
  onBlur?: (event: IonTextareaCustomEvent<FocusEvent>) => void;
  autoGrow?: boolean;
  maxlength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
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
  autoGrow,
  maxlength,
}) => {
  const [valueLenght, setValueLength] = useState<number>(0);
  const inputProps = {
    value,
    type,
    inputMode,
    placeholder,
    name,
    required,
    disabled,
    clearOnEdit,
    ref,
    onIonChange: () => {
      maxlength && setValueLenght();
      onChange();
    },
    onIonBlur: onBlur,
    autoGrow,
    maxlength,
  };

  return (
    <div
      className={`textarea${expand ? ' expand' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      <IonItem lines="none" className={`${error ? 'ion-invalid' : ''}`}>
        {label && <IonLabel position="stacked">{label}</IonLabel>}
        <IonTextarea
          {...inputProps}
          className={`${error ? 'ion-invalid' : ''}`}
        ></IonTextarea>
        {error && (
          <IonNote color="danger" slot="error">
            {error}
          </IonNote>
        )}
        {maxlength && <IonNote color="light" slot="error"></IonNote>}
      </IonItem>
    </div>
  );
};
