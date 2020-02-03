import dotenv from 'dotenv'
import { ratioResult, IRatioResult } from './interfaces'
dotenv.config()

export const JIRA_AUTH_URL = 'https://auth.atlassian.com'
export const JIRA_API_URL = 'https://api.atlassian.com'

export const OAUTH_CALLBACK_URL = `${process.env.ORIGIN}/api/auth/callback`

export const DATE_FORMAT = 'yyyy-MM-dd'

export const valueVsBugsRatios: readonly IRatioResult[] = Object.freeze([
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

export const componentHealthRatios: readonly IRatioResult[] = Object.freeze([
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
