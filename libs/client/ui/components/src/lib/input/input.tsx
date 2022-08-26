import './input.scss';
import {
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
} from '@ionic/react';
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
  label?: string;
  error?: string;
  onIonChange?: (event: IonInputCustomEvent<InputChangeEventDetail>) => void;
}

export const Input: React.FC<InputProps> = ({
  value,
  type,
  inputMode,
  placeholder,
  name,
  required,
  label,
  error,
  onIonChange,
}) => {
  const inputProps = {
    value,
    type,
    inputMode,
    placeholder,
    name,
    required,
    onIonChange,
  };

  return (
    <div className="input">
      <IonGrid>
        <IonRow>
          <IonItem lines="none">
            {label && <IonLabel>{label}</IonLabel>}
            <IonInput {...inputProps}></IonInput>
          </IonItem>
        </IonRow>
        <IonRow>
          {error && (
            <IonText color="danger">
              <small>{error}</small>
            </IonText>
          )}
        </IonRow>
      </IonGrid>
    </div>
  );
};
