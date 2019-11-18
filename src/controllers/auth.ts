import { JiraService } from '../services/Jira'
import { IAuthController, CustomJiraContext } from '../interfaces'

class AuthController implements IAuthController {
  async authenticate (ctx: CustomJiraContext) {
    const jira = new JiraService(ctx.state.user.accessToken)
    const a = await jira.currentUser()
    console.log(a)
    return ''
  }
}

export default new AuthController()
