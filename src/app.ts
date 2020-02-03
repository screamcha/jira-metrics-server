import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import router from './routes'
import passportSetup from './passport'
import logger from './logger'

const app = new Koa()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    logger.error(error.stack)
  }
})
app.use(bodyParser())
app.use(passportSetup())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(process.env.PORT, () => logger.info(`listening on ${process.env.PORT}`))
