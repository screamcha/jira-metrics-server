import Koa from 'koa'
import dotenv from 'dotenv'

dotenv.config()

const app = new Koa()

app.use(() => console.log('hello'))

app.listen(4000, () => console.log('listening'))
