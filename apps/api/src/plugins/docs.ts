import swagger from '@fastify/swagger'
import fp from 'fastify-plugin'

import fastifyApiReference from '@scalar/fastify-api-reference'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export const docsPlugin = fp(async (app) => {
  app.register(swagger, {
    openapi: {
      info: {
        title: 'Portal Master — API',
        version: '0.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  await app.register(fastifyApiReference, {
    routePrefix: '/docs',
    configuration: {
      layout: 'modern',
      hideSearch: true,
    },
  })
})
