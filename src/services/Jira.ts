import axios, { AxiosInstance } from 'axios'
import { format } from 'date-fns'
import { JIRA_METRICS_API_URL } from '../constants'

export enum EIssueType {
  Bug = 'Bug'
}

export interface IJiraService {
  apiURL: string
  apiInstance: AxiosInstance
  currentUser: (token: string) => Promise<IUser>
  getIssues: (token: string, parameters: IIssueParameters) => Promise<Array<IIssue>>
}

export interface IIssueParameters {
  issueType: EIssueType
  startDate: Date
  endDate: Date
}

export interface IUser {
  email?: string
  name: string
  key: string
}

export interface IIssue {
  title: string,
  changelog: {
    histories: IChangelogItem[]
  }
}

interface IChangelogItem {
  id: string
  author: IUser
}

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

  async getIssues (token: string, { issueType, startDate, endDate }: IIssueParameters) {
    const dateFormat = 'yyyy-MM-dd'
    const jqlQuery = `
      issueType = ${issueType} 
        AND status in (Dev-complete, Discarded) 
        AND updated >= ${format(startDate, dateFormat)}
        AND updated <= ${format(endDate, dateFormat)}
    `
    const expandFields = ['changelog']

    const { data } = await this.apiInstance.post('/search', {
      jql: jqlQuery,
      expand: expandFields,
    })

    return data.issues.map((
      { title, changelog }: { title: string, changelog: Object }
    ) => (
      { title, changelog }
    ))
  }
}

export const jiraService = new JiraService()
