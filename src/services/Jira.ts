import axios, { AxiosInstance } from 'axios'
import { format, isWithinInterval } from 'date-fns'
import { JIRA_METRICS_API_URL } from '../constants'

import { IJiraService, IUser, IIssueParameters, EIssueType, IChangelogItem, IIssue } from './Jira.model'
import { IJiraApiSearchResult, IJiraApiIssue, IJiraApiIssueLink, IJiraApiHistoryItem } from '../models/JiraApi.model'

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
            author: historyItem.author,
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

  // private mapJiraApiccIssues (issues: IJiraApiIssue[], { startDate, endDate }: { startDate: Date, endDate: Date }) {
  //   const mappedIssues = issues.map((issue: IJiraApiIssue): IIssue | null => {
  //     const linkedBugs = issue.fields.issuelinks.filter((link: any) => (
  //       link.outwardIssue.fields.issuetype.id === EIssueType.Bug
  //     ))

  //     if (!linkedBugs.length) {
  //       return null
  //     }

  //     const filteredChangelog = issue.changelog.histories
  //       .filter((historyItem: IJiraApiHistoryItem) => (
  //         isWithinInterval(new Date(historyItem.created), { start: startDate, end: endDate }) &&
  //         historyItem.items.filter((item: any) => item.field === 'timespent')
  //       ))
  //       .reduce((result: IChangelogItem[], next: IJiraApiHistoryItem) => result.concat(...next.items), [])

  //     return {
  //       title: issue.key,
  //       changelog: filteredChangelog,
  //       linkedIssues: linkedBugs,
  //     }
  //   })

  //   return mappedIssues.filter((issue: IIssue | null) => !!issue)
  // }
}

export const jiraService = new JiraService()
