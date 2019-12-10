import { AxiosInstance } from 'axios'

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
  getIssues: (token: string, parameters: IIssueParameters) => Promise<Array<IIssue>>
}

export interface IIssueParameters {
  issueTypes: EIssueType[]
  startDate: Date
  endDate: Date
  userKey: string
}

export interface ISearchResult {
  issues: [
    {
      key: string
      changelog: {
        histories: IChangelogItem[]
      }
      fields: {
        issuelinks: [
          {
            outwardIssue: {
              issuetype: {
                title: string
              }
            }
          }
        ]
      }
    }
  ]
}

export interface IUser {
  email?: string
  name: string
  key: string
}

export interface IIssue {
  title: string,
  changelog: IChangelogItem[]
  linkedIssues: IIssue[]
}

export interface IChangelogItem {
  id: string
  author: IUser
  created: string
  items: {
    fieldId: string
    from: number
    to: number
  }
}
