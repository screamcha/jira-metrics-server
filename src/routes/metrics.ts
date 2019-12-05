import Router from 'koa-router'
import passport from 'koa-passport'

import { metricsController } from '../controllers/metrics'

export const metricsRouter = new Router({ prefix: '/metrics' })

metricsRouter.get('/value-vs-bugs',
  passport.authenticate('bearer', { session: false }),
  metricsController.valueVsBugs
)
