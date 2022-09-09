import './otp-input.scss';
import Otp, { OtpInputProps as OtpProps } from 'react-otp-input';
import { IonNote } from '@ionic/react';

export interface OtpInputProps {
  value: string;
  fieldsCount?: number;
  className?: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  fieldsCount = 6,
  className,
  disabled = false,
  onChange,
  error,
  placeholder = '-',
}) => {
  const otpProps: Partial<OtpProps> = {
    isInputNum: true,
    value: value,
    numInputs: fieldsCount,
    isDisabled: disabled,
    placeholder,
  };

  return (
    <div className={`otp-input${className ? ` ${className}` : ''}`}>
      <Otp
        {...otpProps}
        onChange={(value: string) => onChange(value)}
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
