import passport from 'passport'
import LoggerService from '../services/logger.services.js'

export const passportCall = (strategy, { redirect, strategyType } = {}) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error)

      if (!strategyType) {
        LoggerService.fatal(`❓ Route ${req.url} doesn't have defined a strategyType`)
        return res.sendInternalError({
          error: `Route ${req.url} doesn't have defined a strategyType`,
        })
      }

      if (!user) {
        const message = info.message || info.toString()

        switch (strategyType) {
          case 'jwt':
            if (redirect) return res.redirect(redirect)

            req.error = message
            return next()

          case 'locals':
            return res.sendUnauthorized({ error: message })
        }
      }
      req.user = user
      next()
    })(req, res, next)
  }
}