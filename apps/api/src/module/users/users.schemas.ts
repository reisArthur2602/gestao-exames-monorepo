import { z } from 'zod'

export const authenticateUserBodySchema = z.object({
  email: z.string(),
  password: z.string().min(6),
})

export const authenticateUserResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
  }),
})

export const getProfileCurrentUserResponse = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
  }),
})

export const createUserBodySchema = z.object({
  name: z.string().min(2),
  email: z.string(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
})

export const createUserResponseSchema = z.null()

export type AuthenticateUserBody = z.infer<typeof authenticateUserBodySchema>
export type AuthenticateUserResponse = z.infer<
  typeof authenticateUserResponseSchema
>
export type GetProfileCurrentUserResponse = z.infer<
  typeof getProfileCurrentUserResponse
>
export type CreateUserBody = z.infer<typeof createUserBodySchema>
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>
