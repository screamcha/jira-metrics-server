import axios, { AxiosInstance } from 'axios'
import { format } from 'date-fns'
import { JIRA_METRICS_API_URL } from '../constants'

import { IJiraService, IUser, IIssueParameters, IChangelogItem, IIssue } from './Jira.model'
import { IJiraApiSearchResult, IJiraApiIssue, IJiraApiHistoryItem, IJiraApiUser } from '../models/JiraApi.model'

class JiraService implements IJiraService {
  apiURL: string
  apiInstance: AxiosInstance

  static mapJiraApiIssue (issue: IJiraApiIssue) {
    const mappedIssue: IIssue = {
      title: issue.key,
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

  constructor () {
    this.apiURL = process.env.JIRA_API_URL
    this.apiInstance = axios.create({
      baseURL: JIRA_METRICS_API_URL,
    })
  }

  static mapJiraApiUser (user: IJiraApiUser): IUser {
    return {
      name: user.displayName,
      email: user.emailAddress,
      key: user.key,
    }
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
    const issueTypesString = issueTypes
      .reduce(
        (result: string, next: string) => `${result}, '${next}'`, ''
      ).slice(2) // move to utils

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
    const fields = ['issuelinks']

    const { data }: { data: IJiraApiSearchResult } = await this.apiInstance.post('/search', {
      jql: jqlQuery,
      expand: expandFields,
      fields,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const resultIssues = data.issues.map(issue => JiraService.mapJiraApiIssue(issue))

    return resultIssues
  }
}

export const jiraService = new JiraService()
