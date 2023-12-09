import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database-config'
import { randomUUID } from 'crypto'
import { checkIfUserExists } from '../middlewares/check-if-users-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkIfUserExists)

  app.post('/', async (req, reply) => {
    const requestBodySchema = z.object({
      name: z.string(),
      description: z.string().nullable(),
      date: z.string(),
      hour: z.string(),
      category: z.enum(['in', 'out']),
    })

    const { user_id } = req.cookies
    const { name, description, date, hour, category } = requestBodySchema.parse(
      req.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      hour,
      date,
      category,
      user_id,
    })

    reply.status(201).send()
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
    const { user_id } = req.cookies

    const meal = await knex('meals').where({ id, user_id }).first()

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

    reply.status(200).send()
  })

  app.get('/', async (req) => {
    const { user_id } = req.cookies

    const meals = await knex('meals').where({ user_id })

    return {
      meals,
    }
  })

  app.delete('/:id', async (req, reply) => {
    const requestParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = requestParamsSchema.parse(req.params)
    const { user_id } = req.cookies

    const meal = await knex('meals').where({ id, user_id }).first()

    if (!meal) {
      return reply.status(400).send({
        message: 'this meal does not exist',
      })
    }

    await knex('meals').where({ id }).delete()

    reply.status(200).send()
  })

  app.get('/infos', async (req) => {
    const { user_id } = req.cookies

    const meals = await knex('meals').where({ user_id })

    const mealsWithinTheDiet = meals.filter(
      (meal) => meal.category === 'in',
    ).length

    const offDietMeals = meals.filter((meal) => meal.category === 'out').length

    return {
      mealsQuantity: meals.length ?? 0,
      offDietMeals,
      mealsWithinTheDiet,
    }
  })
}
