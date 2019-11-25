import axios, { AxiosInstance } from 'axios'
import { JIRA_METRICS_API_URL } from '../constants'
import { IJiraService, IUser } from '../interfaces'

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
    try {
      const { data } = await this.apiInstance.get('/myself', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const user: IUser = {
        email: data.emailAddress,
        name: data.name,
        key: data.key,
      }

      return user
    } catch (e) {
      console.log(e)
      return null
    }
  }
}

export const jiraService = new JiraService()
