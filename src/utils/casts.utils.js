import mongoose from 'mongoose'
import EErrors from '../services/errors/errors-enum.js'
import ErrorService from '../services/errors/CustomError.js'

const castToMongoId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id)
  } catch (error) {
    ErrorService.createMongoError({
      message: `The provided id (${id}) isn't valid`,
      status: 400,
      stack: error.stack,
      code: EErrors.INVALID_TYPES,
    })
  }
}

export { castToMongoId }