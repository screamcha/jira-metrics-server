import { JiraService } from './Jira'
import { valueVsBugsRatios, componentHealthRatios, metricsRatio } from '../constants'

import { IMetricsService, IComputeValueVsBugsMetricParams, IComputeComponentHealthMetricParams, IComponentHealthResult } from '../models/Metrics.model'
import { EIssueType, ELinkType } from '../models/Jira.model'
import { Issue } from '../models/Issue'

class MetricsService implements IMetricsService {
  static getResultForRatio (ratio: number, metricRatios: readonly metricsRatio[]) {
    let result = metricRatios[0].result

    metricRatios.forEach((templateRatio: metricsRatio) => {
      if (ratio < templateRatio.value) {
        result = templateRatio.result
      }
    })

    return result
  }

  async computeValueVsBugsMetric (
    authHeader: string,
    { startDate, endDate, userKey }: IComputeValueVsBugsMetricParams
  ) {
    const jiraService = new JiraService(authHeader)
    let ratio: number
    let ratioResult: string
    let timeSpentOnIssues: number = 0
    let timeSpentOnBugs: number = 0
    // #1 - get tasks for person for period
    const issues = await jiraService.getIssues({
      issueTypes: [EIssueType.Dev, EIssueType.Epic, EIssueType.Story],
      startDate,
      endDate,
      userKey,
    }, { includeLinkedIssues: true })

    // #2 - compute time spent on issues with bugs
    const issuesWithBugs = issues.filter((issue: Issue) => (
      issue.linkedIssues.some(
        ({ type, parentLinkType }) => type === EIssueType.Bug && parentLinkType === ELinkType.IsCausedBy
      )
    ))

    if (!issuesWithBugs.length) {
      ratio = 0
      ratioResult = MetricsService.getResultForRatio(ratio, valueVsBugsRatios)
    } else {
      timeSpentOnIssues = issuesWithBugs.reduce(
        (result: number, issue: Issue) => (
          result + issue.calculateSpentTime()
        ), 0
      )

      // #3 - get all related bugs
      const bugIds = issuesWithBugs.map((issue: Issue) => (
        issue.linkedIssues
          .filter(({ type }: Issue) => type === EIssueType.Bug)
          .map(({ title }: Issue) => title)
      )).reduce((result: string[], next: string[]) => result.concat(next), [])

      if (bugIds.length) {
        const relatedBugs = await jiraService.getIssuesByIds({ issueIds: bugIds, startDate, endDate })

        timeSpentOnBugs = relatedBugs.reduce(
          (result: number, issue: Issue) => (
            result + issue.calculateSpentTime()
          ), 0
        )
      }

      ratio = timeSpentOnBugs / timeSpentOnIssues
      ratioResult = MetricsService.getResultForRatio(ratio, valueVsBugsRatios)
    }

    return {
      issuesTimeSpent: timeSpentOnIssues,
      bugsTimeSpent: timeSpentOnBugs,
      ratio,
      result: ratioResult,
    }
  }

  async computeComponentHealthMetric (
    authHeader: string,
    { startDate, endDate }: IComputeComponentHealthMetricParams
  ) {
    // #1 - get all close bugs
    const jiraService = new JiraService(authHeader)
    const bugs = await jiraService.getIssues({
      issueTypes: [EIssueType.Bug],
      startDate,
      endDate,
    }, { includeLinkedIssues: false })

    const bugsByComponent = Issue.aggregateByComponenId(bugs)

    // #2 - get info about components
    const componentIds = Object.keys(bugsByComponent)
    const components = (await Promise.all(
      componentIds.map(id => jiraService.getComponentById(id))
    )).filter(component => !!component.leader)

    // #3 = compute bug time per component
    const bugTimePerComponentMap: {[key: string]: number} = {}
    componentIds.forEach(id => {
      const spentTime = bugsByComponent[id].reduce(
        (result: number, issue: Issue) => (
          result + issue.calculateSpentTime()
        ), 0
      )

      bugTimePerComponentMap[id] = spentTime
    })

    // #4 - compute bug time per leader
    const bugTimePerLeaderMap: {[key: string]: number} = {}
    components.forEach(component => {
      if (!bugTimePerLeaderMap[component.leader.name]) {
        bugTimePerLeaderMap[component.leader.name] = 0
      }

      bugTimePerLeaderMap[component.leader.name] += bugTimePerComponentMap[component.id]
    })

    const leaderKeys = Object.keys(bugTimePerLeaderMap)

    const equalShare = leaderKeys.reduce((result: number, next: string) => result + bugTimePerLeaderMap[next], 0) / leaderKeys.length

    // #5 - compute shares
    const results: IComponentHealthResult[] = leaderKeys.map(key => {
      const ratio = (bugTimePerLeaderMap[key] - equalShare) / equalShare
      return {
        leader: key,
        bugTime: bugTimePerLeaderMap[key],
        ratio,
        result: MetricsService.getResultForRatio(ratio, componentHealthRatios),
      }
    })

    return {
      equalShare,
      ratios: results,
    }
  }
}

export const metricsService = new MetricsService()
