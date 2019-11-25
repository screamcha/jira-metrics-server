import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { jiraService } from '../services/Jira'

export default new BearerStrategy(async (token: string, done: Function) => {
  const user = await jiraService.currentUser(token)

  if (!user) {
    return done('Invalid user')
  }

  return done(null, user)
})
