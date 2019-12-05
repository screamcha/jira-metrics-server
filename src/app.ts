import Koa from 'koa'

import router from './routes'
import passportSetup from './passport'

const app = new Koa()

app.use(passportSetup())
app.use(router.routes())

app.listen(process.env.PORT, () => console.log(`listening on ${process.env.PORT}`))
