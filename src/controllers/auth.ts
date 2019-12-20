import HttpCodes from 'http-status-codes'

import { authService } from '../services/auth'

import { Context } from '../interfaces'

export interface ISuccessAuthResponse {
  token: string
}

interface IAuthController {
  authenticate: (ctx: Context) => void
  refresh: (ctx: Context) => void
}

class AuthController implements IAuthController {
  async authenticate (ctx: Context) {
    const { token } = ctx.state.user

    const response: ISuccessAuthResponse = {
      token,
    }

    ctx.body = response
  }

  async refresh (ctx: Context) {
    const { token } = ctx.request.body

    if (!token) {
      ctx.status = HttpCodes.BAD_REQUEST
      return
    }

    const authToken = await authService.refreshAuthToken(token)
    ctx.body = { token: authToken } as ISuccessAuthResponse
  }
}

export const authController = new AuthController()
