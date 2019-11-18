import { ParameterizedContext } from 'koa'
import { AxiosInstance } from 'axios'

export interface IJiraService {
  apiURL: string
  apiInstance: AxiosInstance
  currentUser: () => any
}

interface JiraOauthState {
  user: {
    accessToken: string
  }
}

export type CustomJiraContext = ParameterizedContext<JiraOauthState>

export interface IJiraAuthRequest {
  login: string
  password: string
}

export interface IAuthController {
  authenticate: (ctx: CustomJiraContext) => Promise<string>
}
