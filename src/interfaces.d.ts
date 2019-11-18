import { ParameterizedContext } from 'koa'

export interface IJiraService {
  apiUrl: string
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
  authenticate: (ctx: CustomJiraContext) => string
}
