import axios, { AxiosInstance } from 'axios'
import { format, isWithinInterval } from 'date-fns'
import { Issue } from '../models/Issue'
import { User } from '../models/User'
import { JIRA_METRICS_API_URL } from '../constants'
import { getJqlInString } from '../utils'

import { IJiraService, IIssueParameters, IChangelogItem } from '../models/Jira.model'
import { IJiraApiSearchResult, IJiraApiUser } from '../models/JiraApi.model'

class JiraService implements IJiraService {
  apiURL: string
  apiInstance: AxiosInstance

  constructor () {
    this.apiURL = process.env.JIRA_API_URL
    this.apiInstance = axios.create({
      baseURL: JIRA_METRICS_API_URL,
    })
  }

  async currentUser (token: string) {
    if (!token) {
      return null
    }

    try {
      const { data }: { data: IJiraApiUser } = await this.apiInstance.get('/myself', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const user = new User(data)

      return user
    } catch (e) {
      return null
    }
  }

  async getIssues (token: string, { issueTypes, startDate, endDate, userKey }: IIssueParameters) {
    const dateFormat = 'yyyy-MM-dd'
    const issueTypesString = getJqlInString(issueTypes)

    const jqlQuery = `
      issuetype in (${issueTypesString})
        AND status in (Dev-complete, Discarded)
        AND
          (
            (updated >= ${format(startDate, dateFormat)}
            AND updated <= ${format(endDate, dateFormat)})
          OR
            (created >= ${format(startDate, dateFormat)}
            AND created <= ${format(endDate, dateFormat)})
          )
        AND
          assignee = ${userKey}
    `
    const expandFields = ['changelog']
    const fields = ['issuelinks', 'issuetype']

    const { data }: { data: IJiraApiSearchResult } = await this.apiInstance.post('/search', {
      jql: jqlQuery,
      expand: expandFields,
      fields,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data.issues.map(jiraIssue => {
      const issue = new Issue(jiraIssue)
      const filterCondition =
        ({ created }: IChangelogItem) => isWithinInterval(new Date(created), { start: startDate, end: endDate })
      issue.filterChangelog(filterCondition)
      return issue
    })
  }

  async getIssuesByIds (token: string, { issueIds, startDate, endDate }: IIssueParameters) {
    const issueKeysString = getJqlInString(issueIds)

    const jqlQuery = `
      issueKey IN (${issueKeysString})
    `

    const expandFields = ['changelog']
    const fields = ['issuetype']

    const { data }: { data: IJiraApiSearchResult } = await this.apiInstance.post('/search', {
      jql: jqlQuery,
      expand: expandFields,
      fields,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data.issues.map(jiraIssue => {
      const issue = new Issue(jiraIssue)
      const filterCondition =
        ({ created }: IChangelogItem) => isWithinInterval(new Date(created), { start: startDate, end: endDate })
      issue.filterChangelog(filterCondition)
      return issue
    })
  }
}

export const jiraService = new JiraService()
