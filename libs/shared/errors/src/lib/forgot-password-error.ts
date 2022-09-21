import { ForgotPasswordDto } from '@bregenz-bewegt/shared/types';

export type ForgotPasswordErrorResponse = Partial<ForgotPasswordDto>;
export enum ForgotPasswordError {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

export const forgotPasswordError: {
  [K in ForgotPasswordError]: ForgotPasswordErrorResponse;
} = {
  [ForgotPasswordError.USER_NOT_FOUND]: {
    email: 'Kein Account mit dieser E-Mail Adresse bekannt',
  },
};
