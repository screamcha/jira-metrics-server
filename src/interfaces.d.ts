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
    token: string
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

export interface IGetMyselfFields {
  emailAddress: string
  displayName: string
  key: string
}

export interface IGetMyselfResponse extends IGetMyselfFields {
  [key: string]: any
}
