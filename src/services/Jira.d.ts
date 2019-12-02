import { AxiosInstance } from 'axios'

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
  email: string
  name: string
  key: string
}

export interface IIssue {
  title: string
}
