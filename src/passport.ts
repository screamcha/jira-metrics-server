import passport from 'koa-passport'
import { Strategy as OAuth2Strategy, VerifyCallback } from 'passport-oauth2'

const authorizationURL = 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=SFs5mKYnFnM5B42iYmi0GnDpUmM88OFQ&scope=read%3Ajira-user&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fauth%2Fcallback&state=112&response_type=code&prompt=consent'

export default () => {
  passport.use(new OAuth2Strategy({
    authorizationURL,
    tokenURL: 'https://auth.atlassian.com/oauth/token',
    clientID: process.env.JIRA_CLIENT_ID,
    clientSecret: process.env.JIRA_SECRET_KEY,
    callbackURL: 'http://localhost:4000/api/auth/callback',
  }, (accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback) => {
    return cb(null, { accessToken })
  }))

  return passport.initialize()
}
