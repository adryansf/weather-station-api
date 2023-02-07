import * as yup from 'yup';

export default {
  body: yup.object().shape({
    humidity: yup.number().notRequired(),
    pressure: yup.number().notRequired(),
    temperature: yup.number().notRequired(),
    rain: yup.number().notRequired(),
    solarRadiation: yup.number().notRequired(),
    windDirection: yup.number().notRequired(),
    windVelocity: yup.number().notRequired(),
    createdAt: yup.string().notRequired(),
    multi: yup.array().of(
      yup.object().shape({
        humidity: yup.number().notRequired(),
        pressure: yup.number().notRequired(),
        temperature: yup.number().notRequired(),
        rain: yup.number().notRequired(),
        solarRadiation: yup.number().notRequired(),
        windDirection: yup.number().notRequired(),
        windVelocity: yup.number().notRequired(),
        createdAt: yup.string().notRequired(),
      }),
    ),
  }),
  params: yup.object().shape({
    machineId: yup.string().required(),
  }),
};
