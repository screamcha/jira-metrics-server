import Koa from 'koa'

const app = new Koa()

app.use(() => console.log('hello'))

app.listen(4000, () => console.log('listening'))
