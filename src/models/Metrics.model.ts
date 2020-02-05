export interface IMetricsService {
  computeValueVsBugsMetric: (
    authHeader: string,
    params: IComputeValueVsBugsMetricParams
  ) => Promise<IComputeValueVsBugsMetricResponse>
  computeComponentHealthMetric: (
    authHeader: string,
    params: IComputeComponentHealthMetricParams
  ) => Promise<IComputeComponentHealthMetricResponse>
}

export interface IComputeValueVsBugsMetricParams {
  startDate: Date
  endDate: Date
  userKey: string
}

export interface IComputeComponentHealthMetricParams {
  startDate: Date
  endDate: Date
}

export interface IComputeValueVsBugsMetricResponse {
  issuesTimeSpent: number
  bugsTimeSpent: number
  ratio: number
  result: string
}

export interface IComputeComponentHealthMetricResponse {
  equalShare: number
  ratios: IComponentHealthResult[]
}

export interface IComponentHealthResult {
  leader: string
  ratio: number
  result: string
}
