import jwt from '@fastify/jwt'
import { type FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

export const jwtPlugin = fp(async (app: FastifyInstance) => {
  app.register(jwt, {
    secret: process.env.JWT_SECRET!,
    sign: { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' },
  })
})
