import './otp-input.scss';
import Otp, { OtpInputProps as OtpProps } from 'react-otp-input';
import { IonNote } from '@ionic/react';

export type OtpInputInputType = 'text' | 'number';
export interface OtpInputProps<T extends OtpInputInputType> {
  value?: T extends 'text' ? string : number;
  inputType: T;
  fieldsCount?: number;
  className?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: T extends 'text' ? string | null : number | null) => void;
}

export const OtpInput = <T extends OtpInputInputType>({
  value,
  inputType,
  fieldsCount = 6,
  className,
  disabled = false,
  onChange,
  error,
}: OtpInputProps<T>) => {
  const otpProps: Partial<OtpProps> = {
    value: `${value}`,
    numInputs: fieldsCount,
    isInputNum: inputType === 'text' && true,
    isDisabled: disabled,
    onChange,
  };

  return (
    <div className={`otp-input${className ? ` ${className}` : ''}`}>
      <Otp {...otpProps} className={error ? `error` : ''} />
      {error && (
        <IonNote color="danger" slot="error">
          {error}
        </IonNote>
      )}
    </div>
  );
};
