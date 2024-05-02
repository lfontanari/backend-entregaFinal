import { MulterError } from 'multer'
import CustomError from '../services/errors/CustomError.js'
import { uploader } from '../utils/multer.js'
import httpStatus from 'http-status'

const uploadWithErrorHandling = (uploadFn) => {
  return (req, res, next) => {
    uploadFn(req, res, function (err) {
      try {
        if (err instanceof MulterError) {
          // A Multer error occurred when uploading.
          CustomError.createMulterError({
            message: `${err.message} in field "${err.field}"`,
            cause: err.code,
            metaData: err,
          })
        } else if (err) {
          // An unknown error occurred when uploading.
          CustomError.createError({
            name: 'UnknownErrorUploadingFile',
            message: err.message,
            status: 500,
            metaData: err,
          })
        }
        // Everything went fine.
        next()
      } catch (error) {
        next(error)
      }
    })
  }
}

const uploadFields = (fields = []) => {
  if (!fields || fields.length === 0)
  CustomError.createError({
      name: 'NoFieldsToUpload',
      message: 'No fields to upload',
      cause: 'Must specify at least one field to upload',
      status: httpStatus.INTERNAL_SERVER_ERROR,
    })

  return uploadWithErrorHandling(uploader.fields(fields))
}

const uploadSingle = (fieldName) => {
  if (!fieldName)
  CustomError.createError({
      name: 'NoFieldToUpload',
      message: 'No field name provided',
      cause: 'Must specify the field name to upload',
      status: httpStatus.INTERNAL_SERVER_ERROR,
    })
  return uploadWithErrorHandling(uploader.single(fieldName))
}

const uploadArray = (fieldName, maxCount) => {
  if (!fieldName)
  CustomError.createError({
      name: 'NoFieldToUpload',
      message: 'No field name provided',
      cause: 'Must specify the field name to upload',
      status: httpStatus.INTERNAL_SERVER_ERROR,
    })
  return uploadWithErrorHandling(uploader.array(fieldName, maxCount))
}

const uploadNone = () => {
  return uploadWithErrorHandling(uploader.none())
}

const uploadAny = () => {
  return uploadWithErrorHandling(uploader.any())
}

export const uploaders = {
  single: uploadSingle,
  array: uploadArray,
  fields: uploadFields,
  none: uploadNone,
  any: uploadAny,
}
