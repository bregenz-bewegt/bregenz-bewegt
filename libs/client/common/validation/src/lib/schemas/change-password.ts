import * as yup from 'yup';

export const changePasswordSchema = yup.object().shape({
  password: yup.string().required(),
  newPassword: yup
    .string()
    .required()
    .min(8, 'Passwort muss mindestens ${min} Zeichen enthalten'),
  newPasswordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwörter stimmen nicht überein'),
});
