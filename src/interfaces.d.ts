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

export enum ratioResult {
  NotPerforming = 'not performing',
  Underperforming = 'underperforming',
  MeetsExpectations = 'meets expectations',
  ExceedsExpectations = 'exceeds expectations'
}

export interface IRatioResult {
  value: number
  result: ratioResult
}
