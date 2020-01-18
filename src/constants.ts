import dotenv from 'dotenv'
dotenv.config()

export const JIRA_AUTH_URL = 'https://auth.atlassian.com'
export const JIRA_API_URL = 'https://api.atlassian.com'
export const JIRA_METRICS_API_URL = `${JIRA_API_URL}/ex/jira/ede4ead3-6fc6-4433-828d-3b798cb4b1a7/rest/api/2`

export const OAUTH_CALLBACK_URL = `${process.env.ORIGIN}/api/auth/callback`

export const DATE_FORMAT = 'yyyy-MM-dd'

export enum ratioResult {
  NotPerforming = 'not performing',
  Underperforming = 'underperforming',
  MeetsExpectations = 'meets expectations',
  ExceedsExpectations = 'exceeds expectations'
}

export const valueVsBugsRatios = [
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
]

export const componentHealthRatios = [
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
]
