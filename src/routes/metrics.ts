import Router from 'koa-router'
import { metricsController } from '../controllers/metrics'

export const metricsRouter = new Router({ prefix: '/metrics' })

metricsRouter.get('/value-vs-bugs',
  metricsController.valueVsBugs
)

metricsRouter.get('/component-health',
  metricsController.componentHealth
)
