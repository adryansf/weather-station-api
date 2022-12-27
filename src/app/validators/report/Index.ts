import * as yup from 'yup';

export default {
  query: yup.object().shape({
    page: yup.string().notRequired(),
  }),
  params: yup.object().shape({
    machineId: yup.string().required(),
  }),
};
