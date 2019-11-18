import passport from 'koa-passport'
import { Strategy as OAuth2Strategy, VerifyCallback } from 'passport-oauth2'
import queryString from 'query-string'

const authorizationURL = `https://auth.atlassian.com/authorize?${queryString.stringify({
  audience: 'api.atlassian.com',
  client_id: process.env.JIRA_CLIENT_ID,
  scope: 'read:jira-work read:jira-user read:me',
  redirect_uri: 'http://localhost:4000/api/auth/callback',
  state: '1488228',
  response_type: 'code',
  prompt: 'consent',
})}`

console.log(authorizationURL)

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
