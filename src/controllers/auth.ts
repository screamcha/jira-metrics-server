import { IAuthController, CustomJiraContext } from '../interfaces'

class AuthController implements IAuthController {
  authenticate (ctx: CustomJiraContext) {
    console.log(ctx.state)
    return ''
  }
}

export default new AuthController()
