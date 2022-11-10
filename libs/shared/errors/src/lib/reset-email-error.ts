import { ResetEmailDto } from '@bregenz-bewegt/shared/types';

export type ResetEmailErrorResponse = ResetEmailDto;
export enum ResetEmailError {
  EMAIL_TAKEN = 'EMAIL_TAKEN',
}

export const resetEmailError: {
  [K in ResetEmailError]: ResetEmailErrorResponse;
} = {
  [ResetEmailError.EMAIL_TAKEN]: {
    email: 'E-Mail Adresse bereits in Benutzung',
  },
};
