import Router from 'koa-router'
import passport from 'koa-passport'

import { authController } from '../controllers/auth'

import { IAuthState } from '../interfaces'
import { Context } from 'koa'

export const authRouter = new Router({ prefix: '/auth' })

authRouter.get('/', passport.authenticate('oauth2', { session: false }))

authRouter.get<IAuthState, Context>(
  '/callback',
  passport.authenticate('oauth2', { session: false }),
  authController.authenticate)
