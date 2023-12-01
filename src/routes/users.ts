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
}
