import { NextFunction, Request, Response } from 'express';
import { AnyObjectSchema } from 'yup';
import '../validators/locale';

interface Validator {
  body?: AnyObjectSchema;
  query?: AnyObjectSchema;
  params?: AnyObjectSchema;
}

export default function (validator: Validator) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const status = 400;

    if (validator.body && !(await validator.body.isValid(req.body))) {
      return await validator.body
        .validate(req.body, { abortEarly: false })
        .catch(({ errors }) => {
          return res.status(status).json({ error: errors });
        });
    }

    if (validator.query && !(await validator.query.isValid(req.query))) {
      return await validator.query
        .validate(req.query, { abortEarly: false })
        .catch(({ errors }) => {
          return res.status(status).json({ error: errors });
        });
    }

    if (validator.params && !(await validator.params.isValid(req.params))) {
      return await validator.params
        .validate(req.params, { abortEarly: false })
        .catch(({ errors }) => {
          return res.status(status).json({ error: errors });
        });
    }

    next();
  };
}
