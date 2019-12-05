import { metricsService } from '../services/metrics'

import { Context } from '../interfaces'

interface IMetricsController {
  valueVsBugs: (ctx: Context) => void
}

class MetricsController implements IMetricsController {
  async valueVsBugs (ctx: Context) {
    const { accessToken } = ctx.state.user
    const { startDate, endDate } = ctx.query as { startDate: string, endDate: string }

    console.log(startDate, endDate)

    if (!startDate && !endDate) {
      ctx.status = 400
      return
    }

    await metricsService.computeValueVsBugsMetric(accessToken, { startDate: new Date(startDate), endDate: new Date(endDate) })
    ctx.status = 200
  }
}

export const metricsController = new MetricsController()
