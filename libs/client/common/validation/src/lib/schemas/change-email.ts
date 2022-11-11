import * as yup from 'yup';

export const changeEmailSchema = yup.object().shape({
  email: yup.string().required().email(),
});
