import { metricsService } from '../services/metrics'

import { Context } from '../interfaces'

interface IMetricsController {
  valueVsBugs: (ctx: Context) => void
}

interface IValueVsBugsQuery {
  startDate: string
  endDate: string
  user: string
}

class MetricsController implements IMetricsController {
  async valueVsBugs (ctx: Context) {
    const { token } = ctx.state.user
    const { startDate, endDate, user: userKey } = ctx.query as IValueVsBugsQuery

    if (!startDate && !endDate) {
      ctx.status = 400
      return
    }

    const result = await metricsService.computeValueVsBugsMetric(token, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userKey,
    })

    ctx.status = 200
    ctx.body = result
  }
}

export const metricsController = new MetricsController()
