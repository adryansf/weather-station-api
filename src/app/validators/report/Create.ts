import * as yup from 'yup';

export default {
  body: yup.object().shape({
    humidity: yup.number().notRequired(),
    pressure: yup.number().notRequired(),
    temperature: yup.number().notRequired(),
    rain: yup.number().notRequired(),
    solarRadiation: yup.number().notRequired(),
  }),
  params: yup.object().shape({
    machineId: yup.string().required(),
  }),
};
