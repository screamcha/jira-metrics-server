import axios from 'axios'
import { format, isWithinInterval } from 'date-fns'
import { Issue } from '../models/Issue'
import { User } from '../models/User'
import { getJqlInString } from '../utils'
import { JIRA_METRICS_API_URL, DATE_FORMAT } from '../constants'

import { IJiraService, IIssueParameters, IChangelogItem, EStatus } from '../models/Jira.model'
import { IJiraApiSearchResult, IJiraApiUser } from '../models/JiraApi.model'

class JiraService implements IJiraService {
  apiURL = process.env.JIRA_API_URL
  apiInstance = axios.create({
    baseURL: JIRA_METRICS_API_URL,
  })

  public async currentUser (token: string) {
    if (!token) {
      return null
    }

    const { data }: { data: IJiraApiUser } = await this.apiInstance.get('/myself', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const user = new User(data)

    return user
  }

  public async getIssues (token: string, { issueTypes, startDate, endDate, userKey }: IIssueParameters) {
    const issueTypesString = getJqlInString(issueTypes)

    const jqlQuery = `
      issuetype in (${issueTypesString})
        AND status in ('${EStatus.DevComplete}', '${EStatus.Discarded}')
        AND
          (
            (updated >= ${format(startDate, DATE_FORMAT)}
            AND updated <= ${format(endDate, DATE_FORMAT)})
          OR
            (created >= ${format(startDate, DATE_FORMAT)}
            AND created <= ${format(endDate, DATE_FORMAT)})
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
