import axios, { AxiosInstance } from 'axios'
import { format, isWithinInterval } from 'date-fns'
import { JIRA_METRICS_API_URL } from '../constants'

import { IJiraService, IUser, IIssueParameters, EIssueType, IChangelogItem, ISearchResult, IIssue } from './Jira.model'

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
      ).slice(2)

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

    const { data }: { data: ISearchResult } = await this.apiInstance.post('/search', {
      jql: jqlQuery,
      expand: expandFields,
      fields,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // console.log(data.issues[0].fields)
    // return data.issues[0].fields

    const issuesWithBugs = data.issues
      .filter((issue: any) => {
        const linkedBugs = issue.fields.issuelinks.filter((link: any) => (
          link.outwardIssue.fields.issuetype.id === EIssueType.Bug
        ))

        return linkedBugs.length
      })

    const formattedIssues: IIssue[] = issuesWithBugs.map((issue: any) => {
      const filteredChangelog = issue.changelog.histories
        .filter((historyItem: any) => (
          isWithinInterval(new Date(historyItem.created), {
            start: startDate, end: endDate,
          }) &&
          historyItem.items.filter((item: any) => item.fieldId === 'timespent')
        )
        ).map((historyItem: IChangelogItem) => historyItem.items)

      const linkedBugs = issue.fields.issuelinks.filter((link: any) => (
        link.outwardIssue.fields.issuetype.id === EIssueType.Bug
      ))

      return {
        title: issue.key,
        changelog: filteredChangelog,
        linkedIssues: linkedBugs,
      }
    })

    return formattedIssues
  }

  // private mapIssues (issues: any, { startDate, endDate }) {
  //   return issues.map((issue: any) => {
  //     const filteredChangelog = issue.changelog.histories
  //       .filter((historyItem: IChangelogItem) => (
  //         isWithinInterval(new Date(historyItem.created), {
  //           start: startDate, end: endDate,
  //         }) &&
  //         historyItem.items.filter((item: any) => item.fieldId === 'timespent')
  //       )
  //       ).map((historyItem: IChangelogItem) => historyItem.items)

  //     return { title: issue.key, changelog: filteredChangelog, fields: issue.fields }
  //   })
  // }

  // private filterIssuesWithBugs (issues: any) {
  //   return issues.filter((issue: any) => {
  //     const issueLinks = issue.fields.issuelinks

  //     const linkedBugs = issueLinks.filter((link: any) => (
  //       link.outwardIssue.fields.issuetype.name === EIssueType.Bug
  //     ))

  //     return linkedBugs.length
  //   })
  // }
}

export const jiraService = new JiraService()
