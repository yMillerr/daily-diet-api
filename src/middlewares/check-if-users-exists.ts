import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database-config'

export async function checkIfUserExists(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { session_id } = req.cookies

  if (!session_id) {
    return reply.status(401).send({
      message: 'Unauthorized',
    })
  }

  const user = await knex('users').where({ session_id }).first()

  if (!user) {
    return reply.status(401).send()
  }

  req.userId = user.id
}
