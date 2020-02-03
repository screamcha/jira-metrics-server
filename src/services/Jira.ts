import axios, { AxiosInstance } from 'axios'
import { format, isWithinInterval } from 'date-fns'
import { Component } from '../models/Component'
import { Issue } from '../models/Issue'
import { User } from '../models/User'
import { JIRA_API_URL, DATE_FORMAT } from '../constants'

import { IIssueParameters, IChangelogItem, IGetIssueOptions, IDates, EStatus } from '../models/Jira.model'
import { IJiraApiSearchResult, IJiraApiUser, IJiraApiIssue, IJiraApiComponent } from '../models/JiraApi.model'

export class JiraService {
  apiURL: string
  apiInstance: AxiosInstance
  token: string

  constructor (projectId: string, token?: string) {
    this.apiURL = JIRA_API_URL
    this.apiInstance = axios.create({
      baseURL: `${JIRA_API_URL}/ex/jira/${projectId}/rest/api/2`,
    })

    if (token) {
      this.token = token
      this.apiInstance.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  }

  public async currentUser () {
    if (!this.token) {
      return null
    }

    const { data }: { data: IJiraApiUser } = await this.apiInstance.get('/myself')

    const user = new User(data)

    return user
  }

  public async getIssues (params: IIssueParameters, { includeLinkedIssues }: IGetIssueOptions) {
    const { startDate, endDate } = params
    const jqlQuery = this.getJqlQuery(params)
    const expandFields = ['changelog']
    const fields = ['issuetype', 'components']
    if (includeLinkedIssues) {
      fields.push('issuelinks')
    }

    const { data }: { data: IJiraApiSearchResult } = await this.apiInstance.post('/search', {
      jql: jqlQuery,
      expand: expandFields,
      fields,
    })

    return data.issues.map(this.mapJiraIssue({ startDate, endDate }))
  }

  public async getIssuesByIds ({ issueIds, startDate, endDate }: IIssueParameters) {
    const issueKeysString = this.getJqlInString(issueIds)

    const jqlQuery = `
      issueKey IN (${issueKeysString})
    `

    const expandFields = ['changelog']
    const fields = ['issuetype', 'components']

    const { data }: { data: IJiraApiSearchResult } = await this.apiInstance.post('/search', {
      jql: jqlQuery,
      expand: expandFields,
      fields,
    })

    return data.issues.map(this.mapJiraIssue({ startDate, endDate }))
  }

  public async getComponentById (id: string) {
    const { data }: {data: IJiraApiComponent} = await this.apiInstance.get(`/component/${id}`)

    return new Component(data)
  }

  private mapJiraIssue ({ startDate, endDate }: IDates) {
    return function (jiraIssue: IJiraApiIssue): Issue {
      const issue = new Issue(jiraIssue)
      const filterCondition =
          ({ created }: IChangelogItem) => isWithinInterval(new Date(created), { start: startDate, end: endDate })
      issue.filterChangelog(filterCondition)
      return issue
    }
  }

  private getJqlInString = (values: string[]): string => {
    return values.reduce(
      (result: string, nextValue: string) => `${result}, '${nextValue}'`, ''
    ).slice(2)
  }

  private getJqlQuery ({ startDate, endDate, issueTypes, userKey }: IIssueParameters) {
    const issueTypesString = this.getJqlInString(issueTypes)

    let jqlQuery = `
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
    `

    if (userKey) {
      jqlQuery = `
        ${jqlQuery} AND assignee = ${userKey}
      `
    }

    return jqlQuery
  }
}
