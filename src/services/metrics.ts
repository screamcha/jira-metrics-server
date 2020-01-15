import { jiraService } from './Jira'
import { ratios } from '../constants'

import { IMetricsService, IComputeValueVsBugsMetricParams } from '../models/Metrics.model'
import { EIssueType, ELinkType } from '../models/Jira.model'
import { IIssue } from '../models/Issue'

class MetricsService implements IMetricsService {
  static getResultForRatio (ratio: number) {
    let result = ratios[0].result

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
    let ratio: number
    let ratioResult: string
    let timeSpentOnIssues: number = 0
    let timeSpentOnBugs: number = 0
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
        ({ type, parentLinkType }) => type === EIssueType.Bug && parentLinkType === ELinkType.IsCausedBy
      )
    ))

    if (!issuesWithBugs.length) {
      ratio = 0
      ratioResult = MetricsService.getResultForRatio(ratio)
    } else {
      timeSpentOnIssues = issuesWithBugs.reduce(
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

      if (bugIds.length) {
        const relatedBugs = await jiraService.getIssuesByIds(token, { issueIds: bugIds, startDate, endDate })

        timeSpentOnBugs = relatedBugs.reduce(
          (result: number, issue: IIssue) => (
            result + issue.calculateSpentTime()
          ), 0
        )
      }

      ratio = timeSpentOnBugs / timeSpentOnIssues
      ratioResult = MetricsService.getResultForRatio(ratio)
    }

    return {
      issuesTimeSpent: timeSpentOnIssues,
      bugsTimeSpent: timeSpentOnBugs,
      ratio,
      result: ratioResult,
    }
  }
}

export const metricsService = new MetricsService()
