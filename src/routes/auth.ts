import Router from 'koa-router'
import passport from 'koa-passport'

export const authRouter = new Router({ prefix: '/auth' })

authRouter.get('/', passport.authenticate('oauth2'), async (ctx) => {
  console.log('hi')
})

authRouter.get('/callback', passport.authenticate('oauth2'), async (ctx) => {
  console.log('hihihihi')
})
