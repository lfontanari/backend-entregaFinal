import { existsSync, promises as fs } from 'fs'
import LoggerService from '../../../logger.services.js'

export default class FileSystemPromises {
  #path

  constructor(path) {
    this.#path = path
  }

  exists = () => {
    try {
      return existsSync(this.#path)
    } catch (error) {
      LoggerService.error(error)
    }
  }

  readFile = async () => {
    try {
      const data = await fs.readFile(this.#path, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      LoggerService.error(error)
      throw new Error(`Error reading file or file not found: ${this.#path}}`)
    }
  }

  writeFile = async (data) => {
    try {
      const stringifiedData = JSON.stringify(data, null, 2)
      await fs.writeFile(this.#path, stringifiedData)
    } catch (error) {
      LoggerService.error(error)
      throw new Error('Error writing file')
    }
  }

  createFolder = async () => {
    try {
      await fs.mkdir(this.#path, { recursive: true })
    } catch (error) {
      LoggerService.error(error)
      throw new Error('Error creating folder')
    }
  }

  removeFile = async () => {
    try {
      await fs.unlink(this.#path)
    } catch (error) {
      LoggerService.error(error)
      throw new Error('Error removing file')
    }
  }
}