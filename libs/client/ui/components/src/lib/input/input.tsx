import './input.scss';
import {
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
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
  disabled?: boolean;
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
  disabled,
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
    disabled,
    onIonChange,
  };

  return (
    <div className="input">
      <IonGrid>
        <IonRow>
          <IonItem lines="none" className={`${error ? 'ion-invalid' : ''}`}>
            {label && <IonLabel position="floating">{label}</IonLabel>}
            <IonInput {...inputProps}></IonInput>
            {error && (
              <IonNote color="danger" slot="error">
                {error}
              </IonNote>
            )}
          </IonItem>
        </IonRow>
        <IonRow></IonRow>
      </IonGrid>
    </div>
  );
};
