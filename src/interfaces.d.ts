import { ParameterizedContext } from 'koa'
import { AxiosInstance } from 'axios'

export interface ISuccessAuthResponse {
  token: string
}
export interface IJiraService {
  apiURL: string
  apiInstance: AxiosInstance
  currentUser: (token: string) => Promise<IUser>
}

export interface IUser {
  email: string
  name: string
  key: string
}

interface IAuthState {
  user: {
    accessToken: string
  }
}

export type CustomJiraContext = ParameterizedContext<IAuthState>

export interface IJiraAuthRequest {
  login: string
  password: string
}

export interface IAuthController {
  authenticate: (ctx: CustomJiraContext) => void
}
