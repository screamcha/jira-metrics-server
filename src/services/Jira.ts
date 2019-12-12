import axios, { AxiosInstance } from 'axios'
import { format, isWithinInterval } from 'date-fns'
import { JIRA_METRICS_API_URL } from '../constants'
import { getJqlInString } from '../utils'

import { IJiraService, IUser, IIssueParameters, IChangelogItem, IIssue } from '../models/Jira.model'
import { IJiraApiSearchResult, IJiraApiIssue, IJiraApiHistoryItem, IJiraApiUser } from '../models/JiraApi.model'

class JiraService implements IJiraService {
  apiURL: string
  apiInstance: AxiosInstance

  static mapJiraApiIssue (issue: IJiraApiIssue) {
    const mappedIssue: IIssue = {
      title: issue.key,
      type: issue.fields.issuetype.id,
    }

    if (issue.fields.issuelinks) {
      mappedIssue.linkedIssues = issue.fields.issuelinks.map((link) => this.mapJiraApiIssue(link.outwardIssue))
    }

    if (issue.changelog) {
      mappedIssue.changelog = issue.changelog.histories
        .map((historyItem: IJiraApiHistoryItem) => {
          const timeSpentItem = historyItem.items.find((changeItem) => changeItem.field === 'timespent')

          if (!timeSpentItem) {
            return null
          }

          return {
            created: historyItem.created,
            author: JiraService.mapJiraApiUser(historyItem.author),
            field: timeSpentItem.field,
            from: timeSpentItem.from,
            to: timeSpentItem.to,
          }
        })
        .filter((item: IChangelogItem) => !!item)
    }

    return mappedIssue
  }

  static mapJiraApiUser (user: IJiraApiUser): IUser {
    return {
      name: user.displayName,
      email: user.emailAddress,
      key: user.key,
    }
  }

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
      const { data } = await this.apiInstance.get('/myself', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const user: IUser = {
        email: data.emailAddress,
        name: data.displayName,
        key: data.key,
      }

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

    return data.issues.map(issue => {
      const mappedIssue = JiraService.mapJiraApiIssue(issue)
      if (mappedIssue.changelog) {
        mappedIssue.changelog = mappedIssue.changelog.filter(
          ({ created }) => isWithinInterval(new Date(created), { start: startDate, end: endDate })
        )
      }
      return mappedIssue
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

    return data.issues.map(issue => {
      const mappedIssue = JiraService.mapJiraApiIssue(issue)
      if (mappedIssue.changelog) {
        mappedIssue.changelog = mappedIssue.changelog.filter(
          ({ created }) => isWithinInterval(new Date(created), { start: startDate, end: endDate })
        )
      }
      return mappedIssue
    })
  }
}

export const jiraService = new JiraService()
