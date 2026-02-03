import type { FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { BadRequestError } from '../../../errors/bad-request.js'
import { verifyPassword } from '../../../lib/auth.js'
import {
  authenticateUserBodySchema,
  authenticateUserResponseSchema,
} from '../users.schemas.js'

export const authenticateUser = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sign-in',
    {
      schema: {
        tags: ['Users'],

        summary: 'Authenticate user',
        body: authenticateUserBodySchema,
        operationId: 'login',
        response: {
          200: authenticateUserResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await app.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          passwordHash: true,
          role: true,
        },
      })

      if (!user) throw new BadRequestError('Credenciais inválidas')

      const isPasswordValid = await verifyPassword(password, user.passwordHash)

      if (!isPasswordValid) throw new BadRequestError('Credenciais inválidas')

      const accessToken = await reply.jwtSign(
        { sub: user.id },
        { expiresIn: '7d' }
      )

      return reply.status(200).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      })
    }
  )
}
