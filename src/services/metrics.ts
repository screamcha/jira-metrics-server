import { jiraService, EIssueType } from './Jira'

interface IComputeValueVsBugsMetricParams {
  startDate: Date
  endDate: Date
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
    { startDate, endDate }: IComputeValueVsBugsMetricParams
  ) {
    const result = await jiraService.getIssues(token, {
      issueType: EIssueType.Bug,
      startDate,
      endDate,
    })

    console.log(result[0].changelog)
  }
}

export const metricsService = new MetricsService()
