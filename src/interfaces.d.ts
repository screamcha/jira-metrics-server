import { ParameterizedContext } from 'koa'

interface IContextState {
  user: {
    accessToken: string
  }
}

export type Context = ParameterizedContext<IContextState>

export interface IJiraAuthRequest {
  login: string
  password: string
}

export interface IGetMyselfFields {
  emailAddress: string
  displayName: string
  key: string
}

export interface IGetMyselfResponse extends IGetMyselfFields {
  [key: string]: any
}
