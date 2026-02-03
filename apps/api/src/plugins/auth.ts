import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { UnauthorizedError } from '../errors/unauthorized.js'

export const authPlugin = fastifyPlugin(async (app: FastifyInstance) => {
  app.decorateRequest('getUser', async () => {
    throw new UnauthorizedError('Acesso não autorizado.')
  })

  app.decorateRequest('shouldBeAdmin', async () => {
    throw new UnauthorizedError('Acesso não autorizado.')
  })

  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      const authorizationHeader = request.headers.authorization

      if (!authorizationHeader)
        throw new UnauthorizedError('Token de autenticação não informado.')

      const payload = await request.jwtVerify<{ sub: string }>()

      const user = await app.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, role: true },
      })

      if (!user) {
        throw new UnauthorizedError('Usuário não autorizado ou inexistente.')
      }

      return payload.sub
    }

    request.shouldBeAdmin = async () => {
      const userId = await request.getCurrentUserId()

      const user = await app.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      })

      if (user?.role !== 'ADMIN') {
        throw new UnauthorizedError(
          'Você não tem permissão para realizar esta ação. Caso precise de acesso, entre em contato com o suporte.'
        )
      }
    }
  })
})
