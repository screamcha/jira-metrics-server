import { BAD_REQUEST } from 'http-status-codes'
import { metricsService } from '../services/metrics'

import { Context } from '../interfaces'

interface IMetricsController {
  valueVsBugs: (ctx: Context) => void
  componentHealth: (ctx: Context) => void
}

interface IValueVsBugsQuery {
  startDate: string
  endDate: string
  user: string
  project: string
}

interface IComponentHealthQuery {
  startDate: string
  endDate: string
  project: string
}

class MetricsController implements IMetricsController {
  async valueVsBugs (ctx: Context) {
    const { startDate, endDate, user: userKey, project: projectKey } = ctx.query as IValueVsBugsQuery
    const authHeader = ctx.headers.authorization

    if (!startDate || !endDate || !userKey || !projectKey) {
      ctx.status = BAD_REQUEST
      return
    }

    const result = await metricsService.computeValueVsBugsMetric(authHeader, projectKey, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userKey,
    })

    ctx.status = 200
    ctx.body = result
  }

  async componentHealth (ctx: Context) {
    const { startDate, endDate, project: projectKey } = ctx.query as IComponentHealthQuery
    const authHeader = ctx.headers.authorization

    if (!startDate || !endDate || !projectKey) {
      ctx.status = BAD_REQUEST
      return
    }

    const result = await metricsService.computeComponentHealthMetric(authHeader, projectKey, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    ctx.status = 200
    ctx.body = result
  }
}

export const metricsController = new MetricsController()
