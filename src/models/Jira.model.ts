import { AxiosInstance } from 'axios'
import { Issue } from './Issue'
import { User } from './User'

export enum EIssueType {
  Bug = 'Bug',
  Story = 'Story',
  Dev = 'Dev Task',
  Epic = 'Epic'
}

export enum EStatus {
  DevComplete = 'Dev-complete',
  Discarded = 'Discarded'
}

export enum ELinkType {
  IsCausedBy = 'is caused by'
}

export interface IJiraService {
  apiURL: string
  apiInstance: AxiosInstance
  currentUser: (token: string) => Promise<User>
  getIssues: (token: string, parameters: IIssueParameters) => Promise<Issue[]>
  getIssuesByIds: (token: string, parameters: IIssueParameters) => Promise<Issue[]>
}

export interface IIssueParameters {
  issueTypes?: EIssueType[]
  issueIds?: string[]
  startDate: Date
  endDate: Date
  userKey?: string
}

export interface IChangelogItem {
  author: User
  created: string
  field: string
  from: string
  to: string
}
