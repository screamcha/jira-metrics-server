import { ParameterizedContext } from 'koa'

interface IContextState {
  user: {
    token: string,
    projectId: string
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

export interface IRatioResult<T> {
  value: number
  result: T
}
