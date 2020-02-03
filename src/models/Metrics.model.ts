export interface IMetricsService {
  computeValueVsBugsMetric: (
    token: string,
    projectId: string,
    params: IComputeValueVsBugsMetricParams
  ) => Promise<IComputeValueVsBugsMetricResponse>
  computeComponentHealthMetric: (
    token: string,
    projectId: string,
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
