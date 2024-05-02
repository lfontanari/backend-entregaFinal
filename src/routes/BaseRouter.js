import { Router } from 'express'
import httpStatus from 'http-status'
import EErrors from '../services/errors/errors-enum.js'
import ErrorService from '../services/errors/CustomError.js'
import { passportCall } from '../utils/passport.utils.js'
import { POLICY_STRATEGIES } from '../utils/policiesStrategies.util.js'
import { httpStatusResponse } from '../utils/response.utils.js'
import LoggerService from '../services/logger.services.js'

export default class BaseRouter {
  constructor() {
    this.router = Router()
    this.init()
  }

  init() {
    ErrorService.createInternalError({
      message: 'You have to implement the method init!',
      name: 'BaseRouter Error',
      code: EErrors.METHOD_NOT_IMPLEMENTED,
    })
  }

  getRouter() {
    return this.router
  }

  #handleRoute(method, path, policies, ...callbacks) {
    this.router[method](
      path,
      this.logRequest,
      this.generateCustomResponses,
      passportCall('jwt', { strategyType: 'jwt' }),
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    )
  }

  get(path, policies, ...callbacks) {
    this.#handleRoute('get', path, policies, ...callbacks)
  }

  post(path, policies, ...callbacks) {
    this.#handleRoute('post', path, policies, ...callbacks)
  }

  put(path, policies, ...callbacks) {
    this.#handleRoute('put', path, policies, ...callbacks)
  }

  delete(path, policies, ...callbacks) {
    this.#handleRoute('delete', path, policies, ...callbacks)
  }

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = (message) => res.json({ status: httpStatusResponse.SUCCESS, message })

    res.sendSuccessWithPayload = ({ message, payload }) =>
      res.json({ status: httpStatusResponse.SUCCESS, payload, message })

    res.sendInternalError = ({ error }) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatusResponse.ERROR, error })

    res.sendUnauthorized = ({ error, payload }) =>
      res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatusResponse.ERROR, error, payload })

    res.sendForbidden = ({ error, payload }) =>
      res.status(httpStatus.FORBIDDEN).json({ status: httpStatusResponse.ERROR, error, payload })

    res.sendNotFound = ({ error, payload }) =>
      res.status(httpStatus.NOT_FOUND).json({ status: httpStatusResponse.ERROR, error, payload })

    res.sendBadRequest = ({ error, payload }) =>
      res.status(httpStatus.BAD_REQUEST).json({ status: httpStatusResponse.ERROR, error, payload })

    res.sendCustomError = ({ code, error, payload }) =>
      res.status(code).json({ status: httpStatusResponse.ERROR, error, payload })

    next()
  }

  handlePolicies = (policies) => {
    return (req, res, next) => {
      const { user } = req
      // console.log(req.route);
      const strategyFn = POLICY_STRATEGIES[policies[0]]
       

      if (strategyFn !== undefined) {
        return strategyFn(user, res, next)
      }

      if (!user) return res.sendUnauthorized({ error: req.error })
    

      if (!policies.includes(user.role.toUpperCase()))
        return res.sendForbidden({ error: 'Forbidden' })

      next()
    }
  }

  logRequest = (req, res, next) => {
    LoggerService.http(
      `|API| [${req.method}] - ${req.originalUrl} - ${req.ip} - ${req.headers['user-agent']}`
    )
    next()
  }

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params)
      } catch (error) {
        // eslint-disable-next-line no-unused-vars
        const [req, res, next] = params
        // TODO: test errors
        next(error)
      }
    })
  }
}
