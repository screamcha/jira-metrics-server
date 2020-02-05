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
}

interface IComponentHealthQuery {
  startDate: string
  endDate: string
}

class MetricsController implements IMetricsController {
  async valueVsBugs (ctx: Context) {
    const { startDate, endDate, user: userKey } = ctx.query as IValueVsBugsQuery
    const authHeader = ctx.headers.authorization

    if (!startDate || !endDate || !userKey) {
      ctx.status = BAD_REQUEST
      return
    }

    const result = await metricsService.computeValueVsBugsMetric(authHeader, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userKey,
    })

    ctx.status = 200
    ctx.body = result
  }

  async componentHealth (ctx: Context) {
    const { startDate, endDate } = ctx.query as IComponentHealthQuery
    const authHeader = ctx.headers.authorization

    if (!startDate || !endDate) {
      ctx.status = BAD_REQUEST
      return
    }

    const result = await metricsService.computeComponentHealthMetric(authHeader, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    ctx.status = 200
    ctx.body = result
  }
}

export const metricsController = new MetricsController()
