import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { jiraService } from '../services/Jira'

const authSecret = process.env.AUTH_SECRET

export default new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authSecret,
}, async (payload: { accessToken: string, refreshToken: string }, done: Function) => {
  try {
    const user = await jiraService.currentUser(payload.accessToken)

    if (!user) {
      return done(null, false)
    }

    return done(null, { token: payload.accessToken })
  } catch (error) {
    return done(error)
  }
})
