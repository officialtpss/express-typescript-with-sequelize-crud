import db from './../../models';
const { models } = db.sequelize;
import Error from '../helpers/error.helper';

/**
 * @swagger
 * definitions:
 *   signup:
 *     type: object
 *     required:
 *       - email
 *       - name
 *       - password
 *       - address
 *     properties:
 *       email:
 *         type: string
 *         example: 'techprastish@yopmail.com'
 *       password:
 *         type: string
 *         example: 'VlVkR2VtTXpaSFpqYlZGb1RXcE5QUT09'
 *       name:
 *         type: string
 *         example: 'Tech Prastish'
 *       address:
 *         type: string
 *         example: 'Mohali'
 */

/**
 * @swagger
 * /user:
 *   post:
 *     description: Signup user.
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Body
 *         description:  The request body contains an event
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/signup'
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description:  Internal Server Error
 *
 */

/**
 *
 * @create - create client account
 */
const create = async (req: any, res: any) => {
  try {
    req.body.createdAt = new Date();
    req.body.updatedAt = new Date();
    await models.users.create(req.body);
    res.status(200).send({
      message: 'User created',
    });
  } catch (error) {
    Error.sendError400(error, res);
  }
};

/**
 *
 * @create - create client account
 */
const checkEmail = async (req: any, res: any, next:any) => {
  try {
    req.body.email = req.body.email.toLowerCase();
    req.body.createdAt = new Date();
    req.body.updatedAt = new Date();
    const doc = (await models.users.findOne({ where:{ email: req.body.email },
      attributes: ['id'] })).toJSON();
    if (doc) {
      Error.sendError400({
        message: `${req.body.email} already exist!`,
      },                 res);
      return false;
    }
    next();

  } catch (error) {
    Error.sendError400(error, res);
  }
};

/**
 * @swagger
 * definitions:
 *   signIn:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         example: 'techprastish@yopmail.com'
 *       password:
 *         type: string
 *         example: 'VlVkR2VtTXpaSFpqYlZGb1RXcE5QUT09'
 */

/**
 * @swagger
 * /user:
 *   put:
 *     description: SignIn user
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Body
 *         description:  The request body contains an event
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/signIn'
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description:  Internal Server Error
 *
 */

const login = async (req: any, res: any, next: any) => {
  try {
    req.body.email = req.body.email.toLowerCase();
    const doc: any = (await models.users.findOne({ where: req.body })).toJSON();
    if (!doc) {
      Error.sendError400({
        message: 'Email or password does not match!',
      },                 res);
      return false;
    }
    res.user = doc;
    await models.users.update({ updatedAt: new Date() }, { where: { id: doc.id } });
    next();
  } catch (error) {
    Error.sendError400(error, res);
  }
};

/**
 *
 * @validateUser - in this function we check the user id exist or not.
 *  And also checking the account blocked or unblocked by admin
 */

const validateUser = async (req: any, res: any, next: any) => {
  try {
    const doc: any = (await models.users.findOne({ where: { id: res.userId } })).toJSON();
    if (!doc) {
      Error.sendError401(res);
      return false;
    }
    res.user = doc;
    next();
  } catch (error) {
    Error.sendError400(error, res);
  }
};

/**
 * @swagger
 * definitions:
 *   profile:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: 'Tech Prastish Pvt. Ltd.'
 *       address:
 *         type: string
 *         example: 'CHD'
 */

/**
 * @swagger
 * /user:
 *   patch:
 *     description: Update profile information.
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Bearer token
 *         in: header
 *         required: true
 *         type: string
 *       - name: Body
 *         description:  The request body contains an event
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/profile'
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description:  Internal Server Error
 *
 */

/**
 *
 * @profileUpdate - in this function used to  profile update
 */

const profileUpdate = async (req: any, res: any) => {
  try {
    await models.users.update(req.body, { where: { id: res.userId } });
    res.status(200).send({
      message: 'Profile has been updated successfully.',
    });
  } catch (error) {
    Error.sendError400(error, res);
  }
};

/**
 * @swagger
 * /user:
 *   get:
 *     description: get profile information.
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Bearer token
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description:  Internal Server Error
 *
 */

const getProfile = async (req: any, res: any) => {
  try {
    const user = (await models.users.findOne({ where:{ id: res.userId },
      attributes: ['name', 'email', 'address'] })).toJSON();
    res.status(200).send(user);
  } catch (error) {
    Error.sendError400(error, res);
  }
};

export default {
  create,
  checkEmail,
  login,
  validateUser,
  profileUpdate,
  getProfile,
};
