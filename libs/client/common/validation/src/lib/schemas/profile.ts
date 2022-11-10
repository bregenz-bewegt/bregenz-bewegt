import * as yup from 'yup';

export const profileSchema = yup.object().shape({
  firstname: yup.string(),
  lastname: yup.string(),
  email: yup.string().required().email(),
});
