import axios, { AxiosInstance } from 'axios'
import { IJiraService } from '../interfaces'

export class JiraService implements IJiraService {
  accessToken: string
  apiURL: string
  apiInstance: AxiosInstance

  constructor (accessToken: string) {
    this.accessToken = accessToken
    this.apiURL = process.env.JIRA_API_URL

    this.apiInstance = axios.create({
      baseURL: `${this.apiURL}/ex/jira/${process.env.JIRA_METRICS_PROJECT_ID}/rest/api/2/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  async currentUser () {
    console.log(this.apiInstance)
    try {
      const userInfo = await this.apiInstance.get('/myself')
      console.log(userInfo)
      return userInfo
    } catch (e) {
      console.log(e)
    }
  }
}
