import * as yup from 'yup';

export default {
  body: yup.object().shape({
    name: yup.string().required().min(3).trim(),
  }),
};
