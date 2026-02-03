import Fastify from 'fastify'
import { docsPlugin } from './plugins/docs.js'
import { jwtPlugin } from './plugins/jwt.js'
import { prismaPlugin } from './plugins/prisma.js'

import fastifyRateLimit from '@fastify/rate-limit'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { errorHandler } from './errors/index.js'
import { authRoutes } from './module/users/users.routes.js'

export async function buildApp() {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

  app.register(fastifyRateLimit, {
    max: 20,
    timeWindow: '1 minute',
  })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)
  app.setErrorHandler(errorHandler)

  await app.register(prismaPlugin)
  await app.register(jwtPlugin)
  await app.register(docsPlugin)

  await app.register(authRoutes, { prefix: '/users' })

  return app
}
