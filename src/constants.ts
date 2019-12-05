import dotenv from 'dotenv'
dotenv.config()

export const JIRA_AUTH_URL = 'https://auth.atlassian.com'
export const JIRA_API_URL = 'https://api.atlassian.com'
export const JIRA_METRICS_API_URL = `${JIRA_API_URL}/ex/jira/ede4ead3-6fc6-4433-828d-3b798cb4b1a7/rest/api/2`

export const OAUTH_CALLBACK_URL = `${process.env.ORIGIN}/api/auth/callback`

export const DATE_FORMAT = 'yyyy-MM-dd'
