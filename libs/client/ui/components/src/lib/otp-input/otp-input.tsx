import './otp-input.scss';
import Otp, { OtpInputProps as OtpProps } from 'react-otp-input';
import { IonNote } from '@ionic/react';

export interface OtpInputProps {
  value?: number;
  fieldsCount?: number;
  className?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: number) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  fieldsCount = 6,
  className,
  disabled = false,
  onChange,
  error,
}) => {
  const otpProps: Partial<OtpProps> = {
    isInputNum: true,
    value: value ? `${value}` : undefined,
    numInputs: fieldsCount,
    isDisabled: disabled,
  };

  return (
    <div className={`otp-input${className ? ` ${className}` : ''}`}>
      <Otp
        {...otpProps}
        onChange={(data: any) => {
          console.log(data);
          onChange(data);
        }}
        className={error ? `error` : ''}
      />
      {error && (
        <IonNote color="danger" slot="error">
          {error}
        </IonNote>
      )}
    </div>
  );
};
