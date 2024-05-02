import { PRIVACY_TYPES } from '../constants/constants.js'

export const POLICY_STRATEGIES = {
  [PRIVACY_TYPES.PUBLIC]: (user, res, next) => next(),
  [PRIVACY_TYPES.NO_AUTH]: (user, res, next) => {
    if (user) res.sendUnauthorized({ error: 'Unauthorized' })
    else next()
  },
  [PRIVACY_TYPES.PRIVATE_VIEW]: (user, res, next) => {
    if (!user) res.redirect('/login')
    else next()
  },
  [PRIVACY_TYPES.NO_AUTH_VIEW]: (user, res, next) => {
    if (user) res.redirect('/profile')
    else next()
  },
}