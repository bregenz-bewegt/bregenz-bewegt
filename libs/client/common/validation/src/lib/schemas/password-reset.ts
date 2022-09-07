import * as yup from 'yup';

export const passwordResetSchema = yup.object().shape({
  password: yup
    .string()
    .required()
    .min(8, 'Passwort muss mindestens ${min} Zeichen enthalten'),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwörter stimmen nicht überein'),
});
