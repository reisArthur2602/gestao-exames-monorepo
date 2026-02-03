import argon2 from 'argon2'
import type { FastifyRequest, FastifyReply } from 'fastify'

export async function hashPassword(password: string) {
  return argon2.hash(password)
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password)
}

export function requireRole(roles: Array<'ADMIN' | 'MEMBER'>) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user as { role: 'ADMIN' | 'MEMBER' } | undefined
    if (!user) return reply.code(401).send({ message: 'Não autenticado.' })

    if (!roles.includes(user.role)) {
      return reply.code(403).send({ message: 'Sem permissão.' })
    }
  }
}
