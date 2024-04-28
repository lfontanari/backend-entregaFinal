import httpStatus from 'http-status';
import EErrors from '../services/errors/errors-enum.js';
import CustomError from '../services/errors/CustomError.js';
import { castToMongoId } from '../utils.js';

export const validateUserId = (req, res, next) => {
  const { user } = req
  const { uid } = req.params

  const id = castToMongoId(uid)

  if (user.id !== id.toString()) {
    return CustomError.createError({
      name: 'InvalidUserId',
      status: httpStatus.UNAUTHORIZED,
      code: EErrors.INVALID_VALUES,
      cause: {
        message: `Cannot perform this action with user id "${id}"`,
        user: user.id,
        id,
      },
    })
  }

  next()
}
