import dotenv from 'dotenv'
import { IRatioResult } from './interfaces'
dotenv.config()

export const JIRA_AUTH_URL = 'https://auth.atlassian.com'
export const JIRA_API_URL = 'https://nstest.atlassian.net'

export const OAUTH_CALLBACK_URL = `${process.env.ORIGIN}/api/auth/callback`

export const DATE_FORMAT = 'yyyy-MM-dd'

export enum ratioResult {
  NotPerforming = 'not performing',
  Underperforming = 'underperforming',
  MeetsExpectations = 'meets expectations',
  ExceedsExpectations = 'exceeds expectations'
}
export type metricsRatio = IRatioResult<ratioResult>

export const valueVsBugsRatios: readonly metricsRatio[] = Object.freeze([
  {
    value: 1,
    result: ratioResult.NotPerforming,
  },
  {
    value: 0.4,
    result: ratioResult.Underperforming,
  },
  {
    value: 0.11,
    result: ratioResult.MeetsExpectations,
  },
  {
    value: 0.04,
    result: ratioResult.ExceedsExpectations,
  }
])

export const componentHealthRatios: readonly metricsRatio[] = Object.freeze([
  {
    value: 1,
    result: ratioResult.Underperforming,
  },
  {
    value: 0.2,
    result: ratioResult.MeetsExpectations,
  },
  {
    value: -0.2,
    result: ratioResult.ExceedsExpectations,
  }
])
