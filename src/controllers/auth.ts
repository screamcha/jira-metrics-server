import { IAuthController, CustomJiraContext, ISuccessAuthResponse } from '../interfaces'

class AuthController implements IAuthController {
  async authenticate (ctx: CustomJiraContext) {
    const { accessToken: token } = ctx.state.user

    const response: ISuccessAuthResponse = {
      token,
    }

    ctx.body = response
  }
}

export default new AuthController()
