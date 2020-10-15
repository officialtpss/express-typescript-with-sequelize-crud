import Joi from 'joi';

const validator = (schemaObject: Joi.SchemaMap | undefined) => {
  return (req: { params: any; query: any; body: any; },
          res: { status: (arg0: number) => { (): any; new(): any;
            send: { (arg0: { errors: any[]; }): void; new(): any; }; }; },
          next: (arg0: any) => void) => {
    const payload = Object.assign({}, req.params || {}, req.query || {}, req.body || {});
    Joi.validate(payload, Joi.object().keys(schemaObject), (err: any) => {
      if (err) {
        res.status(400).send(
          {
            errors: errorHandler(err),
          });
      } else { next(err); }
    });
  };
};

const errorHandler = (err: any) => {
  const error : string[] = [];
  for (const key in err.details) {
    if (err.details.hasOwnProperty(key)) {
      error.push(err.details[key].message.replace(/"/g, ''));
    }
  }
  return error;
};

export default validator;
