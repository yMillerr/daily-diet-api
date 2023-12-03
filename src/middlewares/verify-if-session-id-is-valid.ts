import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyIfSessionIdIsValid(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { session_id } = req.cookies

  if (!session_id) {
    return reply.status(401).send({
      message: 'Unauthorized',
    })
  }
}
