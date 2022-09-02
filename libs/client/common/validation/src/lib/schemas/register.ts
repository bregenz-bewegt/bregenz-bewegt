import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
  passwordConfirm: yup.string().required(),
});
