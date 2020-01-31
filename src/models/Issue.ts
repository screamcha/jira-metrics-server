import { User } from './User'

import { IJiraApiIssue, IJiraApiHistoryItem } from './JiraApi.model'
import { EIssueType, IChangelogItem, ELinkType } from './Jira.model'

export class Issue {
  title: string
  type: EIssueType
  changelog: IChangelogItem[]
  componentIds: string[]
  linkedIssues: Issue[]
  parentLinkType: ELinkType

  constructor (issue: IJiraApiIssue) {
    this.title = issue.key
    this.type = issue.fields.issuetype.name
    if (issue.fields.components) {
      this.componentIds = issue.fields.components.map(component => component.id)
    }

    if (issue.fields.issuelinks) {
      this.linkedIssues = issue.fields.issuelinks.map((link) => {
        const childIssue = new Issue(link.outwardIssue)
        childIssue.parentLinkType = link.type.inward
        return childIssue
      })
    }

    if (issue.changelog) {
      this.changelog = issue.changelog.histories
        .map((historyItem: IJiraApiHistoryItem) => {
          const timeSpentItem = historyItem.items.find((changeItem) => changeItem.field === 'timespent')

          if (!timeSpentItem) {
            return null
          }

          return {
            created: historyItem.created,
            author: new User(historyItem.author),
            field: timeSpentItem.field,
            from: timeSpentItem.from,
            to: timeSpentItem.to,
          }
        })
        .filter((item: IChangelogItem) => !!item)
    }
  }

  public filterChangelog (condition: (item: IChangelogItem) => boolean) {
    if (this.changelog) {
      this.changelog = this.changelog.filter(condition)
    }
  }

  public calculateSpentTime (): number {
    return this.changelog.reduce(
      (result: number, item: IChangelogItem) => (
        result + Number(item.to) - Number(item.from)
      ), 0
    )
  }

  public static aggregateByComponenId (issues: Issue[]) {
    const componentIdMap: {[key: string]: Issue[]} = {}

    issues.forEach(issue => {
      issue.componentIds.forEach(componentId => {
        if (!componentIdMap[componentId]) {
          componentIdMap[componentId] = []
        }

        componentIdMap[componentId].push(issue)
      })
    })

    return componentIdMap
  }
}
