import passport from 'koa-passport'

import JwtStrategy from './jwt'
import OAuth2Strategy from './oauth2'

export default () => {
  [JwtStrategy, OAuth2Strategy].forEach(strategy => passport.use(strategy))

  return passport.initialize()
}
