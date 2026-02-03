import type { FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { BadRequestError } from '../../../errors/bad-request.js'
import { hashPassword } from '../../../lib/auth.js'
import { authPlugin } from '../../../plugins/auth.js'
import {
  createUserBodySchema,
  createUserResponseSchema,
} from '../users.schemas.js'

export const createUser = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      '/create',
      {
        schema: {
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          summary: 'Create user',
          operationId: 'createUser',
          body: createUserBodySchema,
          response: {
            201: createUserResponseSchema,
          },
        },
        preHandler: (request, _) => request.shouldBeAdmin(),
      },

      async (request, reply) => {
        const { email, name } = request.body

        const existingUserWithEmail = await app.prisma.user.findUnique({
          where: { email },
        })

        if (existingUserWithEmail)
          throw new BadRequestError(
            'Este e-mail está sendo usado por outro membro'
          )

        const DEFAULT_PASSWORD_USERS = process.env
          .DEFAULT_PASSWORD_USERS as string

        const passwordHash = await hashPassword(DEFAULT_PASSWORD_USERS)

        await app.prisma.user.create({
          data: { email, passwordHash, name },
        })

        return reply.status(201).send(null)
      }
    )
}
