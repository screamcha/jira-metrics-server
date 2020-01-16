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

export interface IDates {
  startDate: Date
  endDate: Date
}

export interface IIssueParameters {
  issueTypes?: EIssueType[]
  issueIds?: string[]
  startDate: Date
  endDate: Date
  userKey?: string
}

export interface IGetByIdParameters {
  id: string
}

export interface IGetIssueOptions {
  includeLinkedIssues?: boolean
}

export interface IChangelogItem {
  author: User
  created: string
  field: string
  from: string
  to: string
}
