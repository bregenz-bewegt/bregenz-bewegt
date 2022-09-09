import './otp-input.scss';
import Otp, { OtpInputProps as OtpProps } from 'react-otp-input';

export type OtpInputInputType = 'text' | 'number';
export interface OtpInputProps<T extends OtpInputInputType> {
  value: T extends 'text' ? string | null : number | null;
  inputType: T;
  fieldsCount?: number;
  className?: string;
  disabled?: boolean;
  onChange: (value: T extends 'text' ? string | null : number | null) => void;
}

export const OtpInput = <T extends OtpInputInputType>({
  value,
  inputType,
  fieldsCount = 6,
  className,
  disabled = false,
  onChange,
}: OtpInputProps<T>) => {
  const otpProps: Partial<OtpProps> = {
    numInputs: fieldsCount,
    isInputNum: inputType === 'text' && true,
    isDisabled: disabled,
    onChange,
  };

  return (
    <div className={`otp-input${className ? ` ${className}` : ''}`}>
      <Otp {...otpProps} />
    </div>
  );
};
