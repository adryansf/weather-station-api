import * as yup from 'yup';

export default {
  params: yup.object().shape({
    machineId: yup.string().required(),
  }),
};
