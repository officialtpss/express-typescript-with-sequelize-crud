import Joi from 'joi';
import validator from '../middleware/schema.validator';
import Jwt from '../middleware/jwt.validator';
import User from '../controllers/user.controller';

const registrationSchema = {
  email: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  address: Joi.string().optional(),
};

const loginSchema = {
  password: Joi.string().required(),
  email: Joi.string().required(),
};

const profileSchema = {
  name: Joi.string().optional(),
  address: Joi.string().optional(),
};

const userRoute = (app: any) => {
  app.route('/user')
    .get(Jwt.decode, User.validateUser, User.getProfile)
    .post(validator(registrationSchema), User.checkEmail, User.create, Jwt.encode)
    .patch(Jwt.decode, validator(profileSchema),  User.validateUser, User.profileUpdate)
    .put(validator(loginSchema), User.login, Jwt.encode);
};

export default userRoute;
