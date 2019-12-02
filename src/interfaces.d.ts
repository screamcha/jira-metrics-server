import { ParameterizedContext } from 'koa'

export interface ISuccessAuthResponse {
  token: string
}

export enum EIssueType {
  Bug
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

export interface IGetMyselfFields {
  emailAddress: string
  displayName: string
  key: string
}

export interface IGetMyselfResponse extends IGetMyselfFields {
  [key: string]: any
}
