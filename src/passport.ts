import passport from 'koa-passport'
import { Strategy as OAuth2Strategy, VerifyCallback } from 'passport-oauth2'
import queryString from 'query-string'
import { JIRA_AUTH_URL, OAUTH_CALLBACK_URL } from './constants'

const scopes = ['read:jira-work', 'read:jira-user', 'read:me']
const authorizationURL = `${JIRA_AUTH_URL}/authorize?${queryString.stringify({
  audience: 'api.atlassian.com',
  client_id: process.env.JIRA_CLIENT_ID,
  scope: scopes.join(' '),
  redirect_uri: OAUTH_CALLBACK_URL,
  response_type: 'code',
  prompt: 'consent',
})}`

export default () => {
  passport.use(new OAuth2Strategy({
    authorizationURL,
    tokenURL: `${JIRA_AUTH_URL}/oauth/token`,
    clientID: process.env.JIRA_CLIENT_ID,
    clientSecret: process.env.JIRA_SECRET_KEY,
    callbackURL: OAUTH_CALLBACK_URL,
  }, (accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback) => {
    return cb(null, { accessToken })
  }))

  return passport.initialize()
}
