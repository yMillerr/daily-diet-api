import { FastifyInstance } from 'fastify'
import { knex } from '../database-config'
import { randomUUID } from 'crypto'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const requestBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      avatar_url: z.string().nullable().default(null),
    })

    const {
      name,
      email,
      password,
      avatar_url: avatarUrl,
    } = requestBodySchema.parse(req.body)

    const checkIfUserExist = await knex('users').where({ email }).first()

    if (checkIfUserExist) {
      reply.status(400).send({
        message: 'This email has already been used',
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password,
      avatar_url: avatarUrl,
    })

    reply.status(201)
  })

  app.post('/login', async (req, reply) => {
    const requestBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = requestBodySchema.parse(req.body)

    const user = await knex('users').where({ email }).first()

    if (!user) {
      return reply.status(400).send({
        message: 'User not exists',
      })
    }

    if (user.password !== password) {
      return reply.status(400).send({
        message: 'email and/or password are incorrect',
      })
    }

    const sessionId = randomUUID()

    await knex('users').where({ id: user.id }).update({ session_id: sessionId })

    reply.status(200).setCookie('session_id', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    })
  })
}
