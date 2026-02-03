import type { FastifyInstance } from 'fastify'
import { authenticateUser } from './http/authenticate-user.js'
import { createUser } from './http/create-user.js'
import { getProfileCurrentUser } from './http/get-profile-current-user.js'

export const authRoutes = (app: FastifyInstance) => {
  ;(app.register(createUser),
    app.register(authenticateUser),
    app.register(getProfileCurrentUser))
}
