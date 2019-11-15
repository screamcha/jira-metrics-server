import Koa from 'koa'
import dotenv from 'dotenv'

import router from './routes'
import passportSetup from './passport'

dotenv.config()

const app = new Koa()

app.use(passportSetup())
app.use(router.routes())

app.listen(4000, () => console.log('listening'))
