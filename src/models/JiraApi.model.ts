import { EIssueType, ELinkType } from './Jira.model'

export interface IJiraApiSearchResult {
  issues: IJiraApiIssue[]
}

export interface IJiraApiIssue {
  key: string
  changelog?: {
    histories: IJiraApiHistoryItem[]
  }
  fields?: {
    issuelinks?: IJiraApiIssueLink[]
    issuetype: {
      name: EIssueType
    }
    components: Array<{
      id: string
    }>
  }
}

export interface IJiraApiHistoryItem {
  id: string
  author: IJiraApiUser
  created: string
  items: IJiraApiHistoryChangeItem[]
}

export interface IJiraApiUser {
  displayName: string
  key: string
  emailAddress: string
}

interface IJiraApiHistoryChangeItem {
  field: string
  from: string
  to: string
}

export interface IJiraApiIssueLink {
  id: string
  type: {
    name: string;
    inward: ELinkType
  }
  outwardIssue: IJiraApiIssue
}

export interface IJiraApiComponent {
  id: string
  name: string
  lead: IJiraApiUser
}
