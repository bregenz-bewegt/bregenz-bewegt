import { VerifyDto } from '@bregenz-bewegt/shared/types';

export type VerifyErrorResponse = Pick<VerifyDto, 'token'>;
export enum VerifyError {
  INVALID_TOKEN = 'INVALID_TOKEN',
}

export const verifyError: { [K in VerifyError]: VerifyErrorResponse } = {
  [VerifyError.INVALID_TOKEN]: {
    token: 'Ungültiger Bestätigungscode',
  },
};
