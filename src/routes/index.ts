import Router from 'koa-router'

import { metricsRouter } from './metrics'

const router = new Router({ prefix: '/api' })

router.use(metricsRouter.routes())

export default router
