import { logger } from '../config/winston.config.js'

export default class LoggerService {
  static fatal(...params) {
    const arrayParams = this.#formatParams(params, '\n')
    logger.fatal(arrayParams)
  }

  static error(...params) {
    const arrayParams = this.#formatParams(params, '\n')
    logger.error(arrayParams)
  }

  static info(...params) {
    const arrayParams = this.#formatParams(params, ' ')
    logger.info(arrayParams)
  }

  static warn(...params) {
    const arrayParams = this.#formatParams(params, ' ')
    logger.warning(arrayParams)
  }

  static http(...params) {
    const arrayParams = this.#formatParams(params, ' ')
    logger.http(arrayParams)
  }

  static debug(...params) {
    const arrayParams = this.#formatParams(params, ' ')
    logger.debug(arrayParams)
  }

  static #formatParams = (params, separator) => {
    return params
      .map((param) => (typeof param === 'object' ? JSON.stringify(param, null, 2) : param))
      .join(separator)
  }
}
