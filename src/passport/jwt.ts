import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { jiraService } from '../services/Jira'

const authSecret = process.env.AUTH_SECRET

export default new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authSecret,
}, async (payload: { accessToken: string, refreshToken: string }, done: Function) => {
  console.log(payload)
  const user = await jiraService.currentUser(payload.accessToken)

  if (!user) {
    return done('Invalid user')
  }

  return done(null, user)
})
