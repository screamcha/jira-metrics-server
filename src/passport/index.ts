import passport from 'koa-passport'

import BearerStrategy from './bearer'
import OAuth2Strategy from './oauth2'

export default () => {
  [BearerStrategy, OAuth2Strategy].forEach(strategy => passport.use(strategy))

  return passport.initialize()
}
