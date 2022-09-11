import * as yup from 'yup';

export const verifySchema = yup.object().shape({
  token: yup
    .string()
    .matches(/^[0-9]+$/, '')
    .required('')
    .min(6, '')
    .max(6, ''),
});
