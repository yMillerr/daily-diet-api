import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database-config'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const requestBodySchema = z.object({
      name: z.string(),
      description: z.string().nullable(),
      date: z.string(),
      hour: z.string(),
      category: z.enum(['in', 'out']),
    })

    const { name, description, date, hour, category } = requestBodySchema.parse(
      req.body,
    )

    const sessionId = req.cookies.session_id

    const user = await knex('users').where({ session_id: sessionId }).first()

    if (!user) {
      return reply.status(400).send({
        message: 'You need to be logged in to create a meal',
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      hour,
      date,
      category,
      user_id: user.id,
    })
  })
}
