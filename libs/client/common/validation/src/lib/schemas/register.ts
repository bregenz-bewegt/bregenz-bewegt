import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  firstname: yup.string(),
  lastname: yup.string(),
  username: yup.string().required(),
  email: yup.string().required().email(),
  password: yup
    .string()
    .required()
    .min(8, 'Passwort muss mindestens ${min} Zeichen enthalten'),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwörter stimmen nicht überein'),
});
