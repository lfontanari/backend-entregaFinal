import multer from 'multer'
import path from 'path'
import { MULTER_PATH_FOLDER } from '../constants/constants.js'
import { MULTER_MAX_FILE_SIZE_MB } from '../constants/envVars.js'
import FileSystemPromises from '../services/db/dao/utils/FileSystemPromises.js'

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const destinationFolder = `${MULTER_PATH_FOLDER}/${file.fieldname}/`

    const fsp = new FileSystemPromises(destinationFolder)
    if (!fsp.exists()) await fsp.createFolder()

    cb(null, destinationFolder)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

export const uploader = multer({
  storage,
  limits: {
    fileSize: MULTER_MAX_FILE_SIZE_MB * 1024 * 1024,
  },
})

/**
 * Extracts the relative path of a file.
 * @param {string} filePath - The path of the file.
 * @param {string} folder - The folder to extract the relative path from.
 * @returns {string} The relative path of the file.
 */
export const extractToRelativePath = (filePath, folder) => {
  const path = filePath.split(folder)[1]
  return `/${folder}${path}`
}

/**
 * Extracts the original name from a filename that has a date prefix, and the extension.
 * @param {string} filename - The filename to extract the original name from.
 * @returns {string} The original name of the file.
 */
export const extractOriginalName = (filename) => {
  const nameArray = filename.split('-')
  // eslint-disable-next-line no-unused-vars
  const [date, ...rest] = nameArray
  const withoutDate = rest.join('-')
  return path.parse(withoutDate).name
}