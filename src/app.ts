import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import router from './routes'
import passportSetup from './passport'

const app = new Koa()

app.use(async (ctx, next) => {
  try {
    console.log(ctx.url)
    await next()
  } catch (error) {
    console.error(error.stack)
  }
})
app.use(bodyParser())
app.use(passportSetup())
app.use(router.routes())

app.listen(process.env.PORT, () => console.log(`listening on ${process.env.PORT}`))
