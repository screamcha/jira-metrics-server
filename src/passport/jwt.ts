import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { JiraService } from '../services/Jira'

const authSecret = process.env.AUTH_SECRET

export default new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authSecret,
}, async (payload: { accessToken: string, refreshToken: string, projectId: string }, done: Function) => {
  try {
    const jiraService = new JiraService(payload.projectId, payload.accessToken)
    const user = await jiraService.currentUser()

    if (!user) {
      return done(null, false)
    }

    return done(null, { token: payload.accessToken, projectId: payload.projectId })
  } catch (error) {
    return done(error)
  }
})
