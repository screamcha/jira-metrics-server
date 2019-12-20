import { jiraService } from './Jira'
import { ratios } from '../constants'

import { IMetricsService, IComputeValueVsBugsMetricParams } from '../models/Metrics.model'
import { EIssueType } from '../models/Jira.model'
import { IIssue } from '../models/Issue'

class MetricsService implements IMetricsService {
  static getResultOfRatio (ratio: number) {
    let result = ''

    ratios.forEach((templateRatio: { value: number, result: string }) => {
      if (ratio < templateRatio.value) {
        result = templateRatio.result
      }
    })

    return result
  }

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
      (result: number, issue: IIssue) => (
        result + issue.calculateSpentTime()
      ), 0
    )

    // #3 - get all related bugs
    const bugIds = issuesWithBugs.map((issue: IIssue) => (
      issue.linkedIssues
        .filter(({ type }: IIssue) => type === EIssueType.Bug)
        .map(({ title }: IIssue) => title)
    )).reduce((result: string[], next: string[]) => result.concat(next), [])

    const relatedBugs = await jiraService.getIssuesByIds(token, { issueIds: bugIds, startDate, endDate })

    const timeSpentOnBugs = relatedBugs.reduce(
      (result: number, issue: IIssue) => (
        result + issue.calculateSpentTime()
      ), 0
    )

    const ratio = timeSpentOnBugs / timeSpentOnIssues
    const ratioResult = MetricsService.getResultOfRatio(ratio)

    return {
      issuesTimeSpent: timeSpentOnIssues,
      bugsTimeSpent: timeSpentOnBugs,
      ratio,
      result: ratioResult,
    }
  }
}

export const metricsService = new MetricsService()
