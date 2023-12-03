import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database-config'

export async function verifyIfUserExist(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { session_id } = req.cookies

  const user = await knex('users').where({ session_id }).first()

  if (!user) {
    return reply.status(404).send({
      message: 'User not found',
    })
  }
}
