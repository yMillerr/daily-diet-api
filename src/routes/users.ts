import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', () => {
    return {
      message: 'Hello World',
    }
  })
}
