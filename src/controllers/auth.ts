import { Context } from '../interfaces'

export interface ISuccessAuthResponse {
  token: string
}

interface IAuthController {
  authenticate: (ctx: Context) => void
}

class AuthController implements IAuthController {
  async authenticate (ctx: Context) {
    const { token } = ctx.state.user

    const response: ISuccessAuthResponse = {
      token,
    }

    ctx.body = response
  }
}

export const authController = new AuthController()
