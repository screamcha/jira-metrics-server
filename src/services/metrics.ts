import { jiraService } from './Jira'
import { EIssueType } from '../models/Jira.model'

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
    const result = await jiraService.getIssues(token, {
      issueTypes: [EIssueType.Dev, EIssueType.Epic, EIssueType.Story],
      startDate,
      endDate,
      userKey,
    })

    return result
  }
}

export const metricsService = new MetricsService()
