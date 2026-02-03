import type { FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { NotFoundError } from '../../../errors/not-found.js'
import { authPlugin } from '../../../plugins/auth.js'
import { getProfileCurrentUserResponse } from '../users.schemas.js'

export const getProfileCurrentUser = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      '/me',
      {
        schema: {
          tags: ['Users'],
          summary: 'Get profile current user',
          security: [{ bearerAuth: [] }],
          operationId: 'getProfileCurrentUserResponse',
          response: {
            200: getProfileCurrentUserResponse,
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const user = await app.prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        })

        if (!user) throw new NotFoundError('Usuário não encontrado')

        return reply.status(200).send({
          user,
        })
      }
    )
}
