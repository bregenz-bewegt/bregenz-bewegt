import './textarea.scss';
import { IonItem, IonLabel, IonNote, IonTextarea } from '@ionic/react';
import {
  TextareaChangeEventDetail,
  IonTextareaCustomEvent,
  TextFieldTypes,
} from '@ionic/core';
import { InputModeTypes } from '@bregenz-bewegt/client/types';

export interface TextAreaProps {
  value?: string | null;
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
    onIonChange: onChange,
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
      <IonItem
        lines="none"
        className={`${error ? 'ion-invalid' : ''}`}
        counter={!!maxlength}
      >
        {label && <IonLabel position="stacked">{label}</IonLabel>}
        <IonTextarea
          {...inputProps}
          className={`${error ? 'ion-invalid' : ''}`}
          rows={3}
        ></IonTextarea>
        {error && (
          <IonNote color="danger" slot="error">
            {error}
          </IonNote>
        )}
      </IonItem>
    </div>
  );
};
