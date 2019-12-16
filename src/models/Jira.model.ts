import { AxiosInstance } from 'axios'
import { IIssue } from './Issue'
import { IUser } from './User'

export enum EIssueType {
  Bug = '10004',
  Story = 'Story',
  Dev = 'Dev Task',
  Epic = 'Epic'
}

export interface IJiraService {
  apiURL: string
  apiInstance: AxiosInstance
  currentUser: (token: string) => Promise<IUser>
  getIssues: (token: string, parameters: IIssueParameters) => Promise<IIssue[]>
  getIssuesByIds: (token: string, parameters: IIssueParameters) => Promise<IIssue[]>
}

export interface IIssueParameters {
  issueTypes?: EIssueType[]
  issueIds?: string[]
  startDate: Date
  endDate: Date
  userKey?: string
}

export interface IChangelogItem {
  author: IUser
  created: string
  field: string
  from: string
  to: string
}