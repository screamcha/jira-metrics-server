import axios, { AxiosInstance } from 'axios'
import { format } from 'date-fns'
import { JIRA_METRICS_API_URL } from '../constants'

import { IJiraService, IIssueParameters, IUser } from './Jira.d'
import { EIssueType } from '../interfaces.d'

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
    // const a = EIssueType.Bug
    // console.log(EIssueType)
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
    const dateFormat = 'YYYY-MM-DD'
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

    console.log(data)
    return data.issues.map((issue: { key: string }) => ({ title: issue.key }))
  }
}

export const jiraService = new JiraService()
