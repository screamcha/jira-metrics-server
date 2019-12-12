import { jiraService } from './Jira'
import { EIssueType, IIssue, IChangelogItem } from '../models/Jira.model'

interface IComputeValueVsBugsMetricParams {
  startDate: Date
  endDate: Date
  userKey: string
}

interface IMetricsService {
  computeValueVsBugsMetric: (
    token: string,
    params: IComputeValueVsBugsMetricParams
  ) => void
}

class MetricsService implements IMetricsService {
  async computeValueVsBugsMetric (
    token: string,
    { startDate, endDate, userKey }: IComputeValueVsBugsMetricParams
  ) {
    // #1 - get tasks for person for period
    const issues = await jiraService.getIssues(token, {
      issueTypes: [EIssueType.Dev, EIssueType.Epic, EIssueType.Story],
      startDate,
      endDate,
      userKey,
    })

    // #2 - compute time spent on issues with bugs
    const issuesWithBugs = issues.filter((issue: IIssue) => (
      issue.linkedIssues.some(
        ({ type }) => type === EIssueType.Bug
      )
    ))

    const timeSpentOnIssues = issuesWithBugs.reduce(
      (result: number, issue: IIssue) => {
        const timeSpentOnIssue = issue.changelog.reduce(
          (result: number, item: IChangelogItem) => (
            result + Number(item.to) - Number(item.from)
          ), 0
        )

        return result + timeSpentOnIssue
      }, 0
    )

    // #3 - get all related bugs
    const bugIds = issuesWithBugs.map((issue: IIssue) => (
      issue.linkedIssues
        .filter(({ type }: IIssue) => type === EIssueType.Bug)
        .map(({ title }: IIssue) => title)
    )).reduce((result: string[], next: string[]) => result.concat(next), [])

    const relatedBugs = await jiraService.getIssuesByIds(token, { issueIds: bugIds, startDate, endDate })

    const timeSpentOnBugs = relatedBugs.reduce(
      (result: number, issue: IIssue) => {
        const timeSpentOnIssue = issue.changelog.reduce(
          (result: number, item: IChangelogItem) => (
            result + Number(item.to) - Number(item.from)
          ), 0
        )

        return result + timeSpentOnIssue
      }, 0
    )

    return {
      timeSpentOnBugs,
      timeSpentOnIssues,
      ratio: timeSpentOnIssues / timeSpentOnBugs * 100,
    }
  }
}

export const metricsService = new MetricsService()
