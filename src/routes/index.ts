import Router from 'koa-router'

import { authRouter } from './auth'
import { metricsRouter } from './metrics'

const router = new Router({ prefix: '/api' })

router.use(authRouter.routes())
router.use(metricsRouter.routes())

export default router
