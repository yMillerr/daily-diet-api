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

  app.put('/:id', async (req, reply) => {
    const requestBodySchema = z.object({
      name: z.string().nullable(),
      description: z.string().nullable(),
      hour: z.string().nullable(),
      date: z.string().nullable(),
      category: z.enum(['in', 'out']).nullable(),
    })

    const requestParamsSchema = z.object({
      id: z.string(),
    })

    const { name, description, hour, date, category } = requestBodySchema.parse(
      req.body,
    )

    const { id } = requestParamsSchema.parse(req.params)

    const meal = await knex('meals').where({ id }).first()

    if (!meal) {
      return reply.status(400).send({
        message: 'This meal does not exist',
      })
    }

    await knex('meals').update({
      name: name ?? meal.name,
      description: description ?? meal.description,
      date: date ?? meal.date,
      hour: hour ?? meal.hour,
      category: category ?? meal.category,
      updated_at: knex.fn.now(),
    })
  })

  app.get('/', async (req, reply) => {
    const { session_id } = req.cookies

    const user = await knex('users').where({ session_id }).first()

    if (!user) {
      return reply.status(400).send({
        message: 'You need to be logged in to create a meal',
      })
    }

    const meals = await knex('meals').where({ user_id: user.id })

    return {
      meals,
    }
  })
}
