import jwt from  'jsonwebtoken';
import { JWT_SECRET } from './../constant';
import  Error from  './../helpers/error.helper';

/**
 *
 * @encode- here generate jwt token
 */
const encode = (req:any, res:any) => {
  try {
    const token =   jwt.sign({
      user: res.user.email,
      id: res.user.id,
    },                       JWT_SECRET);
    res.status(200).send({
      token,
      profile: res.profile,
    });
  } catch (error) {
    Error.sendError400(error, res);
  }
};

/**
 *
 * @decode- here jwt token decode
 */
const decode = (req:any, res:any, next:any) => {
  try {
    if (req.headers.authorization === void 0) {
      Error.sendError401(res);
      return false;
    }
    const accessToken = req.headers.authorization.split(' ');
    if (accessToken[0] !== 'Bearer') {
      Error.sendError401(res);
      return false;
    }
    jwt.verify(accessToken[1], JWT_SECRET, (err:any, decoded:any) => {
      if (err) {
        Error.sendError401(res);
      } else {
        res.userEmail = decoded.user;
        res.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    Error.sendError400(error, res);
  }
};

export default {
  encode,
  decode,
};
