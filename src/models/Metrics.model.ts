export interface IMetricsService {
  computeValueVsBugsMetric: (
    token: string,
    params: IComputeValueVsBugsMetricParams
  ) => Promise<IComputeValueVsBugsMetricResponse>
}

export interface IComputeValueVsBugsMetricParams {
  startDate: Date
  endDate: Date
  userKey: string
}

export interface IComputeValueVsBugsMetricResponse {
  issuesTimeSpent: number
  bugsTimeSpent: number
  ratio: number
  result: string
}
